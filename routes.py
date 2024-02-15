# this file contains api routes of this app
# it contains routes for user registration & login
# it also contains route to generate & verify JWT token

from flask import Blueprint, request, jsonify, current_app
from models import db, User
from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)
# create instance of Blueprint class & pass 'api' & __name__ as args

# User registration route
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

# User login route
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=data['email'])
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401
