from flask import Blueprint, request, jsonify
from models import db, ConstructionDraw, Receipt
from flask_jwt_extended import jwt_required
from datetime import datetime
from models.base import ValidationError

financial_routes = Blueprint('financial', __name__)

@financial_routes.route('/construction-draws/<int:property_id>', methods=['GET'])
@jwt_required()
def get_construction_draws(property_id):
    draws = ConstructionDraw.query.filter_by(property_id=property_id).all()
    return jsonify([draw.to_dict() for draw in draws]), 200

@financial_routes.route('/construction-draws', methods=['POST'])
@jwt_required()
def add_construction_draw():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug log
        
        # Validate required fields
        required_fields = ['property_id', 'release_date', 'amount', 'bank_account_number']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400

        # Validate property_id
        try:
            property_id = int(data['property_id'])
            if property_id <= 0:
                return jsonify({"error": "Property ID must be a positive integer"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "property_id must be a positive integer"}), 400

        # Validate and parse date - handle ISO format with timezone
        try:
            # Split at 'T' and take just the date part
            date_str = data['release_date'].split('T')[0]
            release_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, AttributeError) as e:
            return jsonify({"error": f"Invalid date format: {str(e)}"}), 400

        # Validate amount
        try:
            amount = float(data['amount'])
            if amount <= 0:
                return jsonify({"error": "Amount must be greater than 0"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid amount format"}), 400

        # Create the draw with validated data
        draw = ConstructionDraw(
            property_id=property_id,
            release_date=release_date,
            amount=amount,
            bank_account_number=str(data['bank_account_number']),
            is_approved=bool(data.get('is_approved', False))
        )

        print("Creating draw:", {  # Debug log
            'property_id': draw.property_id,
            'release_date': draw.release_date,
            'amount': draw.amount,
            'bank_account_number': draw.bank_account_number,
            'is_approved': draw.is_approved
        })

        try:
            # This will trigger the validation through the event listener
            db.session.add(draw)
            db.session.commit()
        except ValidationError as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            db.session.rollback()
            print("Database error:", str(e))  # Debug log
            return jsonify({"error": "Failed to save construction draw"}), 500

        return jsonify({
            "message": "Construction draw added successfully",
            "id": draw.id,
            "draw": draw.to_dict()
        }), 201

    except KeyError as e:
        print("KeyError:", str(e))  # Debug log
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except ValueError as e:
        print("ValueError:", str(e))  # Debug log
        return jsonify({"error": f"Invalid value: {str(e)}"}), 400
    except Exception as e:
        print("Unexpected error:", str(e))  # Debug log
        return jsonify({"error": str(e)}), 400  # Changed from 500 to 400 for validation errors

@financial_routes.route('/construction-draws/<int:draw_id>', methods=['PUT'])
@jwt_required()
def update_construction_draw(draw_id):
    try:
        draw = ConstructionDraw.query.get_or_404(draw_id)
        data = request.get_json()
        
        print(f"Updating draw {draw_id} with data: {data}")  # Debug log
        
        # Handle date field specifically - convert from string to date object
        if 'release_date' in data:
            try:
                # Split at 'T' and take just the date part to handle ISO format
                date_str = data['release_date'].split('T')[0]
                release_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                # Update directly on the model instance
                draw.release_date = release_date
            except (ValueError, AttributeError) as e:
                return jsonify({"error": f"Invalid date format: {str(e)}"}), 400
        
        # Handle amount field - convert to float
        if 'amount' in data:
            try:
                amount = float(data['amount'])
                if amount <= 0:
                    return jsonify({"error": "Amount must be greater than 0"}), 400
                # Update directly on the model instance
                draw.amount = amount
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid amount format"}), 400
        
        # Handle property_id field - convert to int
        if 'property_id' in data:
            try:
                property_id = int(data['property_id'])
                if property_id <= 0:
                    return jsonify({"error": "Property ID must be a positive integer"}), 400
                # Update directly on the model instance
                draw.property_id = property_id
            except (ValueError, TypeError):
                return jsonify({"error": "property_id must be a positive integer"}), 400
        
        # Handle bank_account_number field
        if 'bank_account_number' in data:
            if not data['bank_account_number'] or len(str(data['bank_account_number'])) < 4:
                return jsonify({"error": "Bank account number must be at least 4 digits"}), 400
            # Update directly on the model instance
            draw.bank_account_number = str(data['bank_account_number'])
        
        # Handle is_approved field
        if 'is_approved' in data:
            draw.is_approved = bool(data['is_approved'])
        
        # This will trigger the validation through the event listener
        db.session.commit()
        return jsonify({"message": "Construction draw updated successfully"}), 200
    except ValidationError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error updating construction draw: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 500

@financial_routes.route('/construction-draws/<int:draw_id>', methods=['DELETE'])
@jwt_required()
def delete_construction_draw(draw_id):
    try:
        draw = ConstructionDraw.query.get_or_404(draw_id)
        
        # Validate before starting any database operations
        if draw.receipts.count() > 0:
            return jsonify({
                "error": "Cannot delete construction draw with associated receipts. Please delete the receipts first."
            }), 400
            
        # Store draw data before deletion for response
        draw_data = draw.to_dict()
        
        # Now perform the deletion
        db.session.delete(draw)
        db.session.commit()
        
        return jsonify({
            "message": "Construction draw deleted successfully",
            "draw": draw_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting construction draw: {str(e)}")  # Debug log
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