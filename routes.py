# this file contains api routes of this app
# it contains routes for user registration & login
# it also contains route to generate & verify JWT token

from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from datetime import timedelta

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.email, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        return jsonify(email=user.email, first_name=user.first_name, last_name=user.last_name), 200
    else:
        return jsonify({"message": "User not found"}), 404

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        return jsonify(email=user.email, first_name=user.first_name, last_name=user.last_name), 200
    else:
        return jsonify({"message": "User not found"}), 404

@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404