from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import timedelta
import os
import re

auth_routes = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password):
    """Validate password requirements"""
    return len(password) >= 8

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not data.get('first_name'):
        return jsonify({"message": "First name is required"}), 400
    
    if not data.get('last_name'):
        return jsonify({"message": "Last name is required"}), 400
    
    if not data.get('email') or not validate_email(data['email']):
        return jsonify({"message": "Valid email is required"}), 400
    
    if not data.get('password') or not validate_password(data['password']):
        return jsonify({"message": "Password must be at least 8 characters"}), 400

    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email']
    )
    user.set_password(data['password'])

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User Created successfully"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email Already registered"}), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An Error Occurred"}), 500

@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.email, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@auth_routes.route('/auth/google', methods=['POST'])
def google_auth():
    try:
        data = request.json
        if not data or 'credential' not in data or 'userInfo' not in data:
            return jsonify({'error': 'Missing required data'}), 400
            
        print(f"Received user info: {data['userInfo']}")  # Debug log
        
        # Extract user info from the response
        email = data['userInfo'].get('email')
        first_name = data['userInfo'].get('given_name', '')
        last_name = data['userInfo'].get('family_name', '')

        if not email:
            return jsonify({'error': 'Email not found in user info'}), 400

        # Check if user exists
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Create new user if doesn't exist
            user = User(
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            db.session.add(user)
            db.session.commit()

        # Create access token
        access_token = create_access_token(
            identity=email,
            expires_delta=timedelta(days=1)
        )
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }), 200

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': str(e)}), 500 