from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity

user_routes = Blueprint('user', __name__)

@user_routes.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        return jsonify({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'avatar': user.avatar
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404
    
@user_routes.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.avatar = data.get('avatar', user.avatar)
        try:
            db.session.commit()
            return jsonify({"message": "Profile updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"message": "User not found"}), 404
    
@user_routes.route('/profile/password', methods=['PUT'])
@jwt_required()
def update_password():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        if user.check_password(data['current_password']):
            user.set_password(data['new_password'])
            try:
                db.session.commit()
                return jsonify({"message": "Password updated successfully"}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": str(e)}), 500
        else:
            return jsonify({"message": "Invalid password"}), 401
    else:
        return jsonify({"message": "User not found"}), 404 