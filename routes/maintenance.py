from flask import Blueprint, request, jsonify
from models import db, PropertyMaintenanceRequest, Property, Tenant
from flask_jwt_extended import jwt_required

maintenance_routes = Blueprint('maintenance', __name__)

@maintenance_routes.route('/property-maintenance-requests', methods=['GET'])
@jwt_required()
def get_property_maintenance_requests():
    property_id = request.args.get('property_id')
    if property_id:
        requests = PropertyMaintenanceRequest.query.filter_by(propertyId=property_id).all()
    else:
        requests = PropertyMaintenanceRequest.query.all()
    return jsonify([{
        'id': req.id,
        'propertyId': req.propertyId,
        'tenantId': req.tenantId,
        'description': req.description,
        'status': req.status,
        'timeToCompletion': req.timeToCompletion,
        'createdAt': req.createdAt.isoformat(),
        'updatedAt': req.updatedAt.isoformat()
    } for req in requests]), 200

@maintenance_routes.route('/property-maintenance-requests/<int:request_id>', methods=['GET'])
@jwt_required()
def get_property_maintenance_request(request_id):
    request = PropertyMaintenanceRequest.query.get_or_404(request_id)
    return jsonify({
        'id': request.id,
        'propertyId': request.propertyId,
        'tenantId': request.tenantId,
        'description': request.description,
        'status': request.status,
        'timeToCompletion': request.timeToCompletion,
        'createdAt': request.createdAt.isoformat(),
        'updatedAt': request.updatedAt.isoformat()
    }), 200

@maintenance_routes.route('/property-maintenance-requests', methods=['POST'])
@jwt_required()
def add_property_maintenance_request():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Required fields
        required_fields = ['propertyId', 'tenantId', 'description']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        # Validate property and tenant exist
        property = db.session.query(Property).get(data['propertyId'])
        if not property:
            return jsonify({"error": "Property not found"}), 404

        tenant = db.session.query(Tenant).get(data['tenantId'])
        if not tenant:
            return jsonify({"error": "Tenant not found"}), 404

        # Validate status
        valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
        status = data.get('status', 'pending')
        if status not in valid_statuses:
            return jsonify({
                "error": "Invalid status",
                "valid_statuses": valid_statuses
            }), 400

        # Validate timeToCompletion
        time_to_completion = data.get('timeToCompletion')
        if time_to_completion is not None:
            try:
                time_to_completion = int(time_to_completion)
                if time_to_completion < 0:
                    return jsonify({"error": "timeToCompletion cannot be negative"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "timeToCompletion must be a positive integer"}), 400

        maintenance_request = PropertyMaintenanceRequest(
            propertyId=data['propertyId'],
            tenantId=data['tenantId'],
            description=data['description'],
            status=status,
            timeToCompletion=time_to_completion
        )

        db.session.add(maintenance_request)
        db.session.commit()

        return jsonify({
            "message": "Maintenance request created successfully",
            "id": maintenance_request.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@maintenance_routes.route('/property-maintenance-requests/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_property_maintenance_request(request_id):
    maintenance_request = PropertyMaintenanceRequest.query.get_or_404(request_id)
    data = request.get_json()
    try:
        for key, value in data.items():
            if hasattr(maintenance_request, key):
                setattr(maintenance_request, key, value)
        db.session.commit()
        return jsonify({"message": "Maintenance request updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@maintenance_routes.route('/property-maintenance-requests/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_property_maintenance_request(request_id):
    maintenance_request = PropertyMaintenanceRequest.query.get_or_404(request_id)
    try:
        db.session.delete(maintenance_request)
        db.session.commit()
        return jsonify({"message": "Maintenance request deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 