from flask import Blueprint, request, jsonify
from models import db, User, Tenant, Lease, Property
from models.exceptions import ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

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
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Check required fields
        required_fields = ['firstName', 'lastName', 'email', 'dateOfBirth']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400

        # Convert dateOfBirth to date object
        try:
            if isinstance(data['dateOfBirth'], str):
                date_of_birth = datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date()
            else:
                return jsonify({'error': 'dateOfBirth must be a string in YYYY-MM-DD format'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format for dateOfBirth. Expected YYYY-MM-DD'}), 400

        # Convert credit scores to integers if provided
        credit_scores = ['creditScoreAtInitialApplication', 'creditScoreAtLeaseRenewal']
        for field in credit_scores:
            if field in data and data[field] is not None:
                try:
                    data[field] = int(data[field])
                except (ValueError, TypeError):
                    return jsonify({'error': f'Invalid value for {field}. Must be an integer'}), 400

        # Convert boolean fields
        boolean_fields = ['creditCheck1Complete', 'creditCheck2Complete', 'petsAllowed']
        for field in boolean_fields:
            if field in data:
                data[field] = bool(data[field])
            
        tenant = Tenant(
            manager_id=user.id,
            firstName=data['firstName'],
            lastName=data['lastName'],
            phoneNumber=data.get('phoneNumber'),
            email=data['email'],
            dateOfBirth=date_of_birth,
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
        
        # Run all validations
        tenant.validate_tenant()
        
        db.session.add(tenant)
        db.session.commit()
        
        return jsonify({
            'message': 'Tenant created successfully',
            'id': tenant.id,
            'firstName': tenant.firstName,
            'lastName': tenant.lastName,
            'email': tenant.email
        }), 201

    except ValidationError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

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
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Check required fields
        required_fields = ['tenantId', 'propertyId', 'startDate', 'endDate', 'rentAmount', 'typeOfLease']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400

        # Validate tenant and property exist
        tenant = Tenant.query.get(data['tenantId'])
        if not tenant:
            return jsonify({'error': 'Tenant not found'}), 404

        property = Property.query.get(data['propertyId'])
        if not property:
            return jsonify({'error': 'Property not found'}), 404

        # Convert dates
        try:
            if isinstance(data['startDate'], str):
                start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
            else:
                return jsonify({'error': 'startDate must be a string in YYYY-MM-DD format'}), 400

            if isinstance(data['endDate'], str):
                end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
            else:
                return jsonify({'error': 'endDate must be a string in YYYY-MM-DD format'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format. Expected YYYY-MM-DD'}), 400

        # Validate dates
        if start_date >= end_date:
            return jsonify({'error': 'End date must be after start date'}), 400

        # Convert rentAmount to float
        try:
            rent_amount = float(data['rentAmount'])
            if rent_amount <= 0:
                return jsonify({'error': 'Rent amount must be greater than 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid rent amount. Must be a positive number'}), 400

        # Validate lease type
        valid_lease_types = ['Fixed', 'Month-to-Month', 'Lease to Own']
        if data['typeOfLease'] not in valid_lease_types:
            return jsonify({
                'error': 'Invalid lease type',
                'valid_types': valid_lease_types
            }), 400

        lease = Lease(
            tenantId=data['tenantId'],
            propertyId=data['propertyId'],
            startDate=start_date,
            endDate=end_date,
            rentAmount=rent_amount,
            renewalCondition=data.get('renewalCondition'),
            typeOfLease=data['typeOfLease']
        )

        db.session.add(lease)
        db.session.commit()

        return jsonify({
            'message': 'Lease created successfully',
            'id': lease.id,
            'startDate': lease.startDate.isoformat(),
            'endDate': lease.endDate.isoformat(),
            'rentAmount': lease.rentAmount
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

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