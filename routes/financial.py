from flask import Blueprint, request, jsonify
from models import db, ConstructionDraw, Receipt
from flask_jwt_extended import jwt_required
from datetime import datetime

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
    try:
        data = request.get_json()
        draw = ConstructionDraw(
            property_id=data['property_id'],
            release_date=datetime.fromisoformat(data['release_date']).date(),
            amount=float(data['amount']),
            bank_account_number=str(data['bank_account_number']),
            is_approved=bool(data.get('is_approved', False))
        )
        db.session.add(draw)
        db.session.commit()
        return jsonify({"message": "Construction draw added successfully", "id": draw.id}), 201
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid value: {str(e)}"}), 400
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
    try:
        data = request.get_json()
        print("Received receipt data:", data)  # Debug log
        
        # Validate required fields
        required_fields = ['construction_draw_id', 'date', 'vendor', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
            if data[field] is None or data[field] == '':
                return jsonify({"error": f"Field cannot be empty: {field}"}), 400
        
        try:
            # Parse date - expecting format YYYY-MM-DD
            parsed_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            print("Parsed date:", parsed_date)  # Debug log
        except ValueError as e:
            print("Date parsing error:", e)  # Debug log
            return jsonify({"error": f"Invalid date format. Expected YYYY-MM-DD: {str(e)}"}), 400
        
        try:
            amount = float(data['amount'])
            if amount <= 0:
                return jsonify({"error": "Amount must be greater than 0"}), 400
            print("Parsed amount:", amount)  # Debug log
        except ValueError as e:
            print("Amount parsing error:", e)  # Debug log
            return jsonify({"error": f"Invalid amount: {str(e)}"}), 400
        
        # Verify the construction draw exists
        draw = ConstructionDraw.query.get(data['construction_draw_id'])
        if not draw:
            return jsonify({"error": "Construction draw not found"}), 404
        
        # Create receipt with validated data
        receipt = Receipt(
            construction_draw_id=data['construction_draw_id'],
            date=parsed_date,
            vendor=str(data['vendor']),
            amount=amount,
            description=data.get('description', ''),  # Provide default empty string
            pointofcontact=data.get('pointofcontact', ''),  # Provide default empty string
            ccnumber=data.get('ccnumber', '')  # Provide default empty string
        )
        
        print("Created receipt object:", {  # Debug log
            'construction_draw_id': receipt.construction_draw_id,
            'date': receipt.date,
            'vendor': receipt.vendor,
            'amount': receipt.amount,
            'description': receipt.description,
            'pointofcontact': receipt.pointofcontact,
            'ccnumber': receipt.ccnumber
        })
        
        db.session.add(receipt)
        db.session.commit()
        
        return jsonify({
            "message": "Receipt added successfully",
            "id": receipt.id,
            "receipt": {
                "id": receipt.id,
                "construction_draw_id": receipt.construction_draw_id,
                "date": receipt.date.isoformat(),
                "vendor": receipt.vendor,
                "amount": receipt.amount,
                "description": receipt.description,
                "pointofcontact": receipt.pointofcontact,
                "ccnumber": receipt.ccnumber
            }
        }), 201
        
    except KeyError as e:
        print("KeyError:", str(e))  # Debug log
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except ValueError as e:
        print("ValueError:", str(e))  # Debug log
        return jsonify({"error": f"Invalid value: {str(e)}"}), 400
    except Exception as e:
        print("Unexpected error:", str(e))  # Debug log
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