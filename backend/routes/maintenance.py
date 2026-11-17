from flask import Blueprint, request, jsonify
from models import db, PropertyMaintenanceRequest, Property, Tenant, User
from flask_jwt_extended import get_jwt_identity, jwt_required

maintenance_routes = Blueprint('maintenance', __name__)


def _current_user():
    return User.query.filter_by(email=get_jwt_identity()).first()


def _owned_requests(user):
    return PropertyMaintenanceRequest.query.join(
        Property, PropertyMaintenanceRequest.propertyId == Property.id
    ).filter(Property.owner_id == user.id)


def _valid_id(value):
    """Accept integer IDs and numeric strings within the database integer range."""
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        parsed = value
    elif isinstance(value, str) and value.isascii() and value.isdecimal() and len(value) <= 10:
        parsed = int(value)
    else:
        return None
    return parsed if 0 < parsed <= 2147483647 else None


def _owned_property(user, property_id):
    property_id = _valid_id(property_id)
    if property_id is None:
        return None
    return Property.query.filter_by(id=property_id, owner_id=user.id).first()


def _owned_tenant(user, tenant_id):
    tenant_id = _valid_id(tenant_id)
    if tenant_id is None:
        return None
    return Tenant.query.filter_by(id=tenant_id, manager_id=user.id).first()


@maintenance_routes.route('/property-maintenance-requests', methods=['GET'])
@jwt_required()
def get_property_maintenance_requests():
    user = _current_user()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    property_id = request.args.get('property_id')
    query = _owned_requests(user)
    if property_id is not None:
        property = _owned_property(user, property_id)
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        query = query.filter(PropertyMaintenanceRequest.propertyId == property.id)
    requests = query.all()
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
    user = _current_user()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    maintenance_request = _owned_requests(user).filter(
        PropertyMaintenanceRequest.id == request_id
    ).first()
    if not maintenance_request:
        return jsonify({'error': 'Maintenance request not found'}), 404
    return jsonify({
        'id': maintenance_request.id,
        'propertyId': maintenance_request.propertyId,
        'tenantId': maintenance_request.tenantId,
        'description': maintenance_request.description,
        'status': maintenance_request.status,
        'timeToCompletion': maintenance_request.timeToCompletion,
        'createdAt': maintenance_request.createdAt.isoformat(),
        'updatedAt': maintenance_request.updatedAt.isoformat()
    }), 200

@maintenance_routes.route('/property-maintenance-requests', methods=['POST'])
@jwt_required()
def add_property_maintenance_request():
    user = _current_user()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    try:
        data = request.get_json()
        if not isinstance(data, dict) or not data:
            return jsonify({"error": "No data provided"}), 400

        # Required fields
        required_fields = ['propertyId', 'tenantId', 'description']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        # Only allow references to the current user's property and tenant.
        property = _owned_property(user, data['propertyId'])
        if not property:
            return jsonify({"error": "Property not found"}), 404

        tenant = _owned_tenant(user, data['tenantId'])
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
            propertyId=property.id,
            tenantId=tenant.id,
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
    user = _current_user()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    maintenance_request = _owned_requests(user).filter(
        PropertyMaintenanceRequest.id == request_id
    ).first()
    if not maintenance_request:
        return jsonify({'error': 'Maintenance request not found'}), 404

    data = request.get_json(silent=True)
    if not isinstance(data, dict) or not data:
        return jsonify({'error': 'No data provided'}), 400
    allowed_fields = {'propertyId', 'tenantId', 'description', 'status', 'timeToCompletion'}
    if set(data) - allowed_fields:
        return jsonify({'error': 'Unsupported fields'}), 400

    if 'propertyId' in data:
        property = _owned_property(user, data['propertyId'])
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        data['propertyId'] = property.id
    if 'tenantId' in data:
        tenant = _owned_tenant(user, data['tenantId'])
        if not tenant:
            return jsonify({'error': 'Tenant not found'}), 404
        data['tenantId'] = tenant.id
    if 'description' in data and (not isinstance(data['description'], str) or not data['description'].strip()):
        return jsonify({'error': 'Description is required'}), 400
    if 'status' in data and data['status'] not in ['pending', 'in_progress', 'completed', 'cancelled']:
        return jsonify({'error': 'Invalid status'}), 400
    if 'timeToCompletion' in data and data['timeToCompletion'] is not None:
        try:
            time_to_completion = int(data['timeToCompletion'])
            if time_to_completion < 0:
                raise ValueError
            data['timeToCompletion'] = time_to_completion
        except (TypeError, ValueError, OverflowError):
            return jsonify({'error': 'timeToCompletion must be a nonnegative integer'}), 400
    try:
        for key, value in data.items():
            setattr(maintenance_request, key, value)
        db.session.commit()
        return jsonify({"message": "Maintenance request updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@maintenance_routes.route('/property-maintenance-requests/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_property_maintenance_request(request_id):
    user = _current_user()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    maintenance_request = _owned_requests(user).filter(
        PropertyMaintenanceRequest.id == request_id
    ).first()
    if not maintenance_request:
        return jsonify({'error': 'Maintenance request not found'}), 404
    try:
        db.session.delete(maintenance_request)
        db.session.commit()
        return jsonify({"message": "Maintenance request deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
