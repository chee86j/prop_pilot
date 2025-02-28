from flask import Blueprint, request, jsonify
from models import db, PropertyMaintenanceRequest
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
    data = request.get_json()
    maintenance_request = PropertyMaintenanceRequest(
        propertyId=data['propertyId'],
        tenantId=data['tenantId'],
        description=data['description'],
        status=data.get('status', 'pending'),
        timeToCompletion=data.get('timeToCompletion')
    )
    try:
        db.session.add(maintenance_request)
        db.session.commit()
        return jsonify({"message": "Maintenance request added successfully", "id": maintenance_request.id}), 201
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