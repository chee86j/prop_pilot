from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/properties')
def get_properties():
    # Logic to fetch and return properties
    return jsonify([])

@api.route('/transactions')
def get_transactions():
    # Logic to fetch and return transactions
    return jsonify([])
