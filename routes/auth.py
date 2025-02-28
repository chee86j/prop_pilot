from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import timedelta
import os

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
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
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.email, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@auth_routes.route('/auth/google', methods=['POST'])
def google_auth():
    try:
        token = request.json.get('credential')
        
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            os.getenv('GOOGLE_CLIENT_ID')
        )

        # Get user info from the token
        email = idinfo['email']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

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

    except ValueError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500 