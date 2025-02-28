from flask import Blueprint, request, jsonify
from models import db, User, Tenant, Lease
from flask_jwt_extended import jwt_required, get_jwt_identity

tenant_routes = Blueprint('tenant', __name__)

@tenant_routes.route('/tenants', methods=['GET'])
@jwt_required()
def get_all_tenants():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenants = Tenant.query.filter_by(manager_id=user.id).all()
        return jsonify([{
            'id': tenant.id,
            'firstName': tenant.firstName,
            'lastName': tenant.lastName,
            'phoneNumber': tenant.phoneNumber,
            'email': tenant.email,
            'dateOfBirth': tenant.dateOfBirth.isoformat() if tenant.dateOfBirth else None,
            'occupation': tenant.occupation,
            'employerName': tenant.employerName,
            'professionalTitle': tenant.professionalTitle,
            'creditScoreAtInitialApplication': tenant.creditScoreAtInitialApplication,
            'creditCheck1Complete': tenant.creditCheck1Complete,
            'creditScoreAtLeaseRenewal': tenant.creditScoreAtLeaseRenewal,
            'creditCheck2Complete': tenant.creditCheck2Complete,
            'guarantor': tenant.guarantor,
            'petsAllowed': tenant.petsAllowed
        } for tenant in tenants]), 200
    return jsonify({"message": "User not found"}), 404

@tenant_routes.route('/tenants/<int:tenant_id>', methods=['GET'])
@jwt_required()
def get_tenant(tenant_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenant = Tenant.query.filter_by(id=tenant_id, manager_id=user.id).first()
        if tenant:
            return jsonify({
                'id': tenant.id,
                'firstName': tenant.firstName,
                'lastName': tenant.lastName,
                'phoneNumber': tenant.phoneNumber,
                'email': tenant.email,
                'dateOfBirth': tenant.dateOfBirth.isoformat() if tenant.dateOfBirth else None,
                'occupation': tenant.occupation,
                'employerName': tenant.employerName,
                'professionalTitle': tenant.professionalTitle,
                'creditScoreAtInitialApplication': tenant.creditScoreAtInitialApplication,
                'creditCheck1Complete': tenant.creditCheck1Complete,
                'creditScoreAtLeaseRenewal': tenant.creditScoreAtLeaseRenewal,
                'creditCheck2Complete': tenant.creditCheck2Complete,
                'guarantor': tenant.guarantor,
                'petsAllowed': tenant.petsAllowed
            }), 200
        return jsonify({"message": "Tenant not found"}), 404
    return jsonify({"message": "User not found"}), 404

@tenant_routes.route('/tenants', methods=['POST'])
@jwt_required()
def add_tenant():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        tenant = Tenant(
            manager_id=user.id,
            firstName=data['firstName'],
            lastName=data['lastName'],
            phoneNumber=data.get('phoneNumber'),
            email=data['email'],
            dateOfBirth=data['dateOfBirth'],
            occupation=data.get('occupation'),
            employerName=data.get('employerName'),
            professionalTitle=data.get('professionalTitle'),
            creditScoreAtInitialApplication=data.get('creditScoreAtInitialApplication'),
            creditCheck1Complete=data.get('creditCheck1Complete', False),
            creditScoreAtLeaseRenewal=data.get('creditScoreAtLeaseRenewal'),
            creditCheck2Complete=data.get('creditCheck2Complete', False),
            guarantor=data.get('guarantor'),
            petsAllowed=data.get('petsAllowed', False)
        )
        try:
            db.session.add(tenant)
            db.session.commit()
            return jsonify({"message": "Tenant added successfully", "id": tenant.id}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    return jsonify({"message": "User not found"}), 404

@tenant_routes.route('/tenants/<int:tenant_id>', methods=['PUT'])
@jwt_required()
def update_tenant(tenant_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenant = Tenant.query.filter_by(id=tenant_id, manager_id=user.id).first()
        if tenant:
            data = request.get_json()
            try:
                for key, value in data.items():
                    if hasattr(tenant, key):
                        setattr(tenant, key, value)
                db.session.commit()
                return jsonify({"message": "Tenant updated successfully"}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": str(e)}), 500
        return jsonify({"message": "Tenant not found"}), 404
    return jsonify({"message": "User not found"}), 404

@tenant_routes.route('/tenants/<int:tenant_id>', methods=['DELETE'])
@jwt_required()
def delete_tenant(tenant_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenant = Tenant.query.filter_by(id=tenant_id, manager_id=user.id).first()
        if tenant:
            try:
                db.session.delete(tenant)
                db.session.commit()
                return jsonify({"message": "Tenant deleted successfully"}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": str(e)}), 500
        return jsonify({"message": "Tenant not found"}), 404
    return jsonify({"message": "User not found"}), 404

# Lease routes
@tenant_routes.route('/leases/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property_leases(property_id):
    leases = Lease.query.filter_by(propertyId=property_id).all()
    return jsonify([{
        'id': lease.id,
        'tenantId': lease.tenantId,
        'propertyId': lease.propertyId,
        'startDate': lease.startDate.isoformat(),
        'endDate': lease.endDate.isoformat(),
        'rentAmount': lease.rentAmount,
        'renewalCondition': lease.renewalCondition,
        'typeOfLease': lease.typeOfLease
    } for lease in leases]), 200

@tenant_routes.route('/leases/<int:lease_id>', methods=['GET'])
@jwt_required()
def get_lease(lease_id):
    lease = Lease.query.get_or_404(lease_id)
    return jsonify({
        'id': lease.id,
        'tenantId': lease.tenantId,
        'propertyId': lease.propertyId,
        'startDate': lease.startDate.isoformat(),
        'endDate': lease.endDate.isoformat(),
        'rentAmount': lease.rentAmount,
        'renewalCondition': lease.renewalCondition,
        'typeOfLease': lease.typeOfLease
    }), 200

@tenant_routes.route('/leases', methods=['POST'])
@jwt_required()
def create_lease():
    data = request.get_json()
    lease = Lease(
        tenantId=data['tenantId'],
        propertyId=data['propertyId'],
        startDate=data['startDate'],
        endDate=data['endDate'],
        rentAmount=data['rentAmount'],
        renewalCondition=data.get('renewalCondition'),
        typeOfLease=data['typeOfLease']
    )
    try:
        db.session.add(lease)
        db.session.commit()
        return jsonify({"message": "Lease created successfully", "id": lease.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@tenant_routes.route('/leases/<int:lease_id>', methods=['PUT'])
@jwt_required()
def update_lease(lease_id):
    lease = Lease.query.get_or_404(lease_id)
    data = request.get_json()
    try:
        for key, value in data.items():
            if hasattr(lease, key):
                setattr(lease, key, value)
        db.session.commit()
        return jsonify({"message": "Lease updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@tenant_routes.route('/leases/<int:lease_id>', methods=['DELETE'])
@jwt_required()
def delete_lease(lease_id):
    lease = Lease.query.get_or_404(lease_id)
    try:
        db.session.delete(lease)
        db.session.commit()
        return jsonify({"message": "Lease deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 