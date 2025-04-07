from flask import Blueprint, request, jsonify, session
from models import db, User
from flask_jwt_extended import create_access_token, set_access_cookies
from sqlalchemy.exc import IntegrityError
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import timedelta, datetime
import os
import re
from utils.images import url_to_base64
import logging
from typing import Tuple, Dict, Any
from http import HTTPStatus
import time

logger = logging.getLogger(__name__)

auth_routes = Blueprint('auth', __name__)

def create_auth_response(user: User, message: str = None) -> Tuple[Dict[str, Any], int]:
    """
    Create a standardized auth response with user data and token.
    
    Args:
        user: User model instance
        message: Optional message to include in response
        
    Returns:
        Tuple of response dict and status code
    """
    # Create access token with enhanced security
    access_token = create_access_token(
        identity=user.email,
        fresh=True,
        additional_claims={
            'email': user.email,
            'auth_time': int(time.time())
        }
    )
    
    # Set session data
    session['user_id'] = user.id
    session['last_login'] = datetime.utcnow().isoformat()
    session['auth_method'] = 'email'
    
    response = jsonify({
        'access_token': access_token,
        'user': {
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar': user.avatar
        }
    })
    
    if message:
        response.json['message'] = message
    
    # Set secure cookie with the JWT
    set_access_cookies(response, access_token)
    
    return response, HTTPStatus.OK

def validate_email(email: str) -> bool:
    """Validate email format"""
    return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

def validate_password(password: str) -> bool:
    """
    Validate password requirements:
    - Minimum 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    """
    if len(password) < 12:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True

@auth_routes.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = {
            'first_name': "First name is required",
            'last_name': "Last name is required",
            'email': "Valid email is required",
            'password': "Password must be at least 8 characters"
        }
        
        for field, message in required_fields.items():
            if not data.get(field):
                return jsonify({"message": message}), HTTPStatus.BAD_REQUEST
            
        if not validate_email(data['email']):
            return jsonify({"message": "Valid email is required"}), HTTPStatus.BAD_REQUEST
            
        if not validate_password(data['password']):
            return jsonify({"message": "Password must be at least 8 characters"}), HTTPStatus.BAD_REQUEST

        user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return create_auth_response(user, "User created successfully")

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email already registered"}), HTTPStatus.CONFLICT
    except Exception as e:
        db.session.rollback()
        logger.error(f"❌ Registration error: {str(e)}")
        return jsonify({"message": "An error occurred"}), HTTPStatus.INTERNAL_SERVER_ERROR

@auth_routes.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"message": "Email and password are required"}), HTTPStatus.BAD_REQUEST
            
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            return create_auth_response(user)
            
        return jsonify({"message": "Invalid credentials"}), HTTPStatus.UNAUTHORIZED
        
    except Exception as e:
        logger.error(f"❌ Login error: {str(e)}")
        return jsonify({"message": "An error occurred"}), HTTPStatus.INTERNAL_SERVER_ERROR

@auth_routes.route('/auth/google', methods=['POST'])
def google_auth():
    try:
        data = request.json
        if not data or 'token_info' not in data or 'userInfo' not in data:
            logger.error("❌ Missing required data in request")
            return jsonify({'error': 'Missing required data'}), HTTPStatus.BAD_REQUEST
            
        token_info = data['token_info']
        user_info = data['userInfo']
        
        logger.debug("🔍 Received Google auth request", {
            'email': user_info.get('email'),
            'name': user_info.get('name')
        })

        # Verify the token info
        try:
            # Verify token hasn't expired
            if float(token_info.get('exp', 0)) < time.time():
                raise ValueError('Token has expired.')
                
            # Verify audience matches our client ID
            if token_info.get('aud') != os.getenv('VITE_GOOGLE_CLIENT_ID'):
                raise ValueError('Wrong audience.')
                
            # Verify email is verified
            if not user_info.get('email_verified'):
                raise ValueError('Email not verified by Google.')
                
            logger.debug("✅ Token info verified successfully")
            
        except ValueError as e:
            logger.error(f"❌ Token verification failed: {str(e)}")
            return jsonify({'error': f'Invalid token: {str(e)}'}), HTTPStatus.UNAUTHORIZED

        email = user_info.get('email')
        if not email:
            return jsonify({'error': 'Email not found in user info'}), HTTPStatus.BAD_REQUEST

        # Handle avatar conversion
        avatar = url_to_base64(user_info.get('picture')) if user_info.get('picture') else None
        
        # Get or create user
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                email=email,
                first_name=user_info.get('given_name', ''),
                last_name=user_info.get('family_name', ''),
                avatar=avatar
            )
            db.session.add(user)
            logger.info(f"👤 Created new user: {email}")
        elif avatar:
            user.avatar = avatar
            logger.info(f"🔄 Updated avatar for: {email}")
            
        db.session.commit()
        
        # Set auth method to 'google' for this session
        session['auth_method'] = 'google'
        
        return create_auth_response(user)

    except Exception as e:
        logger.error(f"❌ Google auth error: {str(e)}")
        return jsonify({'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@auth_routes.route('/logout', methods=['POST'])
def logout():
    try:
        # Clear session
        session.clear()
        
        response = jsonify({'message': 'Successfully logged out'})
        response.delete_cookie('access_token_cookie')
        response.delete_cookie('csrf_access_token')
        
        logger.info("👋 User logged out successfully")
        return response, HTTPStatus.OK
        
    except Exception as e:
        logger.error(f"❌ Logout error: {str(e)}")
        return jsonify({'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR 