from flask import Blueprint, request, jsonify
from models import db, ConstructionDraw, Receipt
from flask_jwt_extended import jwt_required

financial_routes = Blueprint('financial', __name__)

@financial_routes.route('/construction-draws/<int:property_id>', methods=['GET'])
@jwt_required()
def get_construction_draws(property_id):
    draws = ConstructionDraw.query.filter_by(property_id=property_id).all()
    return jsonify([{
        'id': draw.id,
        'property_id': draw.property_id,
        'release_date': draw.release_date.isoformat(),
        'amount': draw.amount,
        'bank_account_number': draw.bank_account_number,
        'is_approved': draw.is_approved
    } for draw in draws]), 200

@financial_routes.route('/construction-draws', methods=['POST'])
@jwt_required()
def add_construction_draw():
    data = request.get_json()
    draw = ConstructionDraw(
        property_id=data['property_id'],
        release_date=data['release_date'],
        amount=data['amount'],
        bank_account_number=data['bank_account_number'],
        is_approved=data.get('is_approved', False)
    )
    try:
        db.session.add(draw)
        db.session.commit()
        return jsonify({"message": "Construction draw added successfully", "id": draw.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@financial_routes.route('/construction-draws/<int:draw_id>', methods=['PUT'])
@jwt_required()
def update_construction_draw(draw_id):
    draw = ConstructionDraw.query.get_or_404(draw_id)
    data = request.get_json()
    try:
        for key, value in data.items():
            if hasattr(draw, key):
                setattr(draw, key, value)
        db.session.commit()
        return jsonify({"message": "Construction draw updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@financial_routes.route('/construction-draws/<int:draw_id>', methods=['DELETE'])
@jwt_required()
def delete_construction_draw(draw_id):
    draw = ConstructionDraw.query.get_or_404(draw_id)
    try:
        db.session.delete(draw)
        db.session.commit()
        return jsonify({"message": "Construction draw deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@financial_routes.route('/receipts/<int:draw_id>', methods=['GET'])
@jwt_required()
def get_receipts(draw_id):
    receipts = Receipt.query.filter_by(construction_draw_id=draw_id).all()
    return jsonify([{
        'id': receipt.id,
        'construction_draw_id': receipt.construction_draw_id,
        'date': receipt.date.isoformat(),
        'vendor': receipt.vendor,
        'amount': receipt.amount,
        'description': receipt.description,
        'pointofcontact': receipt.pointofcontact,
        'ccnumber': receipt.ccnumber
    } for receipt in receipts]), 200

@financial_routes.route('/receipts', methods=['POST'])
@jwt_required()
def add_receipt():
    data = request.get_json()
    receipt = Receipt(
        construction_draw_id=data['construction_draw_id'],
        date=data['date'],
        vendor=data['vendor'],
        amount=data['amount'],
        description=data.get('description'),
        pointofcontact=data.get('pointofcontact'),
        ccnumber=data.get('ccnumber')
    )
    try:
        db.session.add(receipt)
        db.session.commit()
        return jsonify({"message": "Receipt added successfully", "id": receipt.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@financial_routes.route('/receipts/<int:receipt_id>', methods=['PUT'])
@jwt_required()
def update_receipt(receipt_id):
    receipt = Receipt.query.get_or_404(receipt_id)
    data = request.get_json()
    try:
        for key, value in data.items():
            if hasattr(receipt, key):
                setattr(receipt, key, value)
        db.session.commit()
        return jsonify({"message": "Receipt updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@financial_routes.route('/receipts/<int:receipt_id>', methods=['DELETE'])
@jwt_required()
def delete_receipt(receipt_id):
    receipt = Receipt.query.get_or_404(receipt_id)
    try:
        db.session.delete(receipt)
        db.session.commit()
        return jsonify({"message": "Receipt deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 