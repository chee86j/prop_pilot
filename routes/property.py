from flask import Blueprint, request, jsonify
from models import db, User, Property, Phase, ConstructionDraw, Receipt
from models.base import ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from services.scraper.main import main as run_scraper
import pandas as pd
import os
from models.exceptions import (
    DrawSequenceError, 
    DrawAmountError, 
    DrawApprovalError,
    ReceiptAmountError,
    ReceiptDateError,
    ReceiptDuplicateError
)

property_routes = Blueprint('property', __name__)

def convert_to_float(value, default=0.0):
    try:
        return float(value) if value else default
    except (ValueError, TypeError):
        return default

@property_routes.route('/properties/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property(property_id):
    current_user_email = get_jwt_identity()
    user = db.session.query(User).filter_by(email=current_user_email).first()
    if user:
        property = db.session.query(Property).filter_by(id=property_id, owner_id=user.id).first()
        if property:
            return jsonify({
                'id': property.id,
                'detail_link': property.detail_link,
                'property_id': property.property_id,
                'sheriff_number': property.sheriff_number,
                'status_date': property.status_date.isoformat() if property.status_date else None,
                'plaintiff': property.plaintiff,
                'defendant': property.defendant,
                'zillow_url': property.zillow_url,
                'propertyName': property.propertyName,
                'address': property.address,
                'city': property.city,
                'state': property.state,
                'zipCode': property.zipCode,
                'county': property.county,
                'bedroomsDescription': property.bedroomsDescription,
                'bathroomsDescription': property.bathroomsDescription,
                'kitchenDescription': property.kitchenDescription,
                'amenitiesDescription': property.amenitiesDescription,
                'municipalBuildingAddress': property.municipalBuildingAddress,
                'buildingDepartmentContact': property.buildingDepartmentContact,
                'electricDepartmentContact': property.electricDepartmentContact,
                'plumbingDepartmentContact': property.plumbingDepartmentContact,
                'fireDepartmentContact': property.fireDepartmentContact,
                'homeownersAssociationContact': property.homeownersAssociationContact,
                'environmentalDepartmentContact': property.environmentalDepartmentContact,
                'purchaseCost': property.purchaseCost,
                'refinanceCosts': property.refinanceCosts,
                'totalRehabCost': property.totalRehabCost,
                'equipmentCost': property.equipmentCost,
                'constructionCost': property.constructionCost,
                'largeRepairsCost': property.largeRepairsCost,
                'renovationCost': property.renovationCost,
                'kickStartFunds': property.kickStartFunds,
                'lenderConstructionDrawsReceived': property.lenderConstructionDrawsReceived,
                'utilitiesCost': property.utilitiesCost,
                'sewer': property.sewer,
                'water': property.water,
                'lawn': property.lawn,
                'garbage': property.garbage,
                'yearlyPropertyTaxes': property.yearlyPropertyTaxes,
                'mortgagePaid': property.mortgagePaid,
                'homeownersInsurance': property.homeownersInsurance,
                'expectedYearlyRent': property.expectedYearlyRent,
                'rentalIncomeReceived': property.rentalIncomeReceived,
                'numUnits': property.numUnits,
                'vacancyRate': property.vacancyRate,
                'avgTenantStay': property.avgTenantStay,
                'otherMonthlyIncome': property.otherMonthlyIncome,
                'vacancyLoss': property.vacancyLoss,
                'managementFees': property.managementFees,
                'maintenanceCosts': property.maintenanceCosts,
                'totalEquity': property.totalEquity,
                'arvSalePrice': property.arvSalePrice,
                'realtorFees': property.realtorFees,
                'propTaxtillEndOfYear': property.propTaxtillEndOfYear,
                'lenderLoanBalance': property.lenderLoanBalance,
                'payOffStatement': property.payOffStatement,
                'attorneyFees': property.attorneyFees,
                'miscFees': property.miscFees,
                'utilities': property.utilities,
                'cash2closeFromPurchase': property.cash2closeFromPurchase,
                'cash2closeFromRefinance': property.cash2closeFromRefinance,
                'totalRehabCosts': property.totalRehabCosts,
                'expectedRemainingRentEndToYear': property.expectedRemainingRentEndToYear,
                'totalExpenses': property.totalExpenses,
                'totalConstructionDrawsReceived': property.totalConstructionDrawsReceived,
                'projectNetProfitIfSold': property.projectNetProfitIfSold,
                'cashFlow': property.cashFlow,
                'cashRoi': property.cashRoi,
                'rule2Percent': property.rule2Percent,
                'rule50Percent': property.rule50Percent,
                'financeAmount': property.financeAmount,
                'purchaseCapRate': property.purchaseCapRate,
                'typeOfHeatingAndCooling': property.typeOfHeatingAndCooling,
                'waterCompany': property.waterCompany,
                'waterAccountNumber': property.waterAccountNumber,
                'electricCompany': property.electricCompany,
                'electricAccountNumber': property.electricAccountNumber,
                'gasOrOilCompany': property.gasOrOilCompany,
                'gasOrOilAccountNumber': property.gasOrOilAccountNumber,
                'sewerCompany': property.sewerCompany,
                'sewerAccountNumber': property.sewerAccountNumber,
                'sellersAgent': property.sellersAgent,
                'sellersBroker': property.sellersBroker,
                'sellersAgentPhone': property.sellersAgentPhone,
                'sellersAttorney': property.sellersAttorney,
                'sellersAttorneyPhone': property.sellersAttorneyPhone,
                'escrowCompany': property.escrowCompany,
                'escrowAgent': property.escrowAgent,
                'escrowAgentPhone': property.escrowAgentPhone,
                'buyersAgent': property.buyersAgent,
                'buyersBroker': property.buyersBroker,
                'buyersAgentPhone': property.buyersAgentPhone,
                'buyersAttorney': property.buyersAttorney,
                'buyersAttorneyPhone': property.buyersAttorneyPhone,
                'titleInsuranceCompany': property.titleInsuranceCompany,
                'titleAgent': property.titleAgent,
                'titleAgentPhone': property.titleAgentPhone,
                'titlePhone': property.titlePhone,
                'lender': property.lender,
                'lenderPhone': property.lenderPhone,
                'refinanceLender': property.refinanceLender,
                'refinanceLenderPhone': property.refinanceLenderPhone,
                'loanOfficer': property.loanOfficer,
                'loanOfficerPhone': property.loanOfficerPhone,
                'loanNumber': property.loanNumber,
                'downPaymentPercentage': property.downPaymentPercentage,
                'loanInterestRate': property.loanInterestRate,
                'pmiPercentage': property.pmiPercentage,
                'mortgageYears': property.mortgageYears,
                'lenderPointsAmount': property.lenderPointsAmount,
                'otherFees': property.otherFees,
                'propertyManager': property.propertyManager,
                'propertyManagerPhone': property.propertyManagerPhone,
                'propertyManagementCompany': property.propertyManagementCompany,
                'propertyManagementPhone': property.propertyManagementPhone,
                'photographer': property.photographer,
                'photographerPhone': property.photographerPhone,
                'videographer': property.videographer,
                'videographerPhone': property.videographerPhone,
                'appraisalCompany': property.appraisalCompany,
                'appraiser': property.appraiser,
                'appraiserPhone': property.appraiserPhone,
                'surveyor': property.surveyor,
                'surveyorPhone': property.surveyorPhone,
                'homeInspector': property.homeInspector,
                'homeInspectorPhone': property.homeInspectorPhone,
                'architect': property.architect,
                'architectPhone': property.architectPhone
            }), 200
        return jsonify({"message": "Property not found"}), 404
    return jsonify({"message": "User not found"}), 404

@property_routes.route('/properties', methods=['GET'])
@jwt_required()
def get_properties():
    current_user_email = get_jwt_identity()
    user = db.session.query(User).filter_by(email=current_user_email).first()
    if user:
        properties = db.session.query(Property).filter_by(owner_id=user.id).all()
        return jsonify([{
            'id': property.id,
            'propertyName': property.propertyName,
            'address': property.address,
            'city': property.city,
            'state': property.state,
            'zipCode': property.zipCode,
            'county': property.county,
            'purchaseCost': property.purchaseCost,
            'totalRehabCost': property.totalRehabCost,
            'arvSalePrice': property.arvSalePrice
        } for property in properties]), 200
    return jsonify({"message": "User not found"}), 404

@property_routes.route('/properties', methods=['POST'])
@jwt_required()
def add_property():
    current_user_email = get_jwt_identity()
    user = db.session.query(User).filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Required fields
        required_fields = ['propertyName', 'address', 'city', 'state', 'zipCode']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        # Handle date conversion
        status_date = data.get('status_date')
        if status_date:
            if isinstance(status_date, str):
                try:
                    status_date = datetime.strptime(status_date, '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({"error": "Invalid date format for status_date. Expected YYYY-MM-DD"}), 400
            elif not isinstance(status_date, date):
                return jsonify({"error": "status_date must be a string in YYYY-MM-DD format or a date object"}), 400

        # Convert numeric fields
        numeric_fields = ['purchaseCost', 'totalRehabCost', 'arvSalePrice', 'equipmentCost', 
                         'constructionCost', 'largeRepairsCost', 'renovationCost']
        for field in numeric_fields:
            if field in data:
                try:
                    data[field] = float(data[field])
                except (ValueError, TypeError):
                    return jsonify({"error": f"Invalid value for {field}. Must be a number"}), 400

        # Set purchase_price from purchaseCost for model compatibility
        purchase_price = data.get('purchaseCost', 0.0)

        property = Property(
            owner_id=user.id,
            address=data.get('address'),
            purchase_price=purchase_price,  # Required field
            current_phase='ACQUISITION',  # Required field with default value
            propertyName=data.get('propertyName'),
            city=data.get('city'),
            state=data.get('state'),
            zipCode=data.get('zipCode'),
            county=data.get('county'),
            bedroomsDescription=data.get('bedroomsDescription'),
            bathroomsDescription=data.get('bathroomsDescription'),
            kitchenDescription=data.get('kitchenDescription'),
            amenitiesDescription=data.get('amenitiesDescription'),
            detail_link=data.get('detail_link'),
            property_id=data.get('property_id'),
            sheriff_number=data.get('sheriff_number'),
            status_date=status_date,
            plaintiff=data.get('plaintiff'),
            defendant=data.get('defendant'),
            zillow_url=data.get('zillow_url'),
            purchaseCost=data.get('purchaseCost'),
            totalRehabCost=data.get('totalRehabCost'),
            equipmentCost=data.get('equipmentCost'),
            constructionCost=data.get('constructionCost'),
            largeRepairsCost=data.get('largeRepairsCost'),
            renovationCost=data.get('renovationCost'),
            arvSalePrice=data.get('arvSalePrice')
        )

        db.session.add(property)
        db.session.commit()

        return jsonify({
            "id": property.id,
            "propertyName": property.propertyName,
            "address": property.address,
            "city": property.city,
            "state": property.state,
            "zipCode": property.zipCode,
            "message": "Property added successfully"
        }), 201

    except ValidationError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@property_routes.route('/properties/<int:property_id>', methods=['PUT'])
@jwt_required()
def update_property(property_id):
    current_user_email = get_jwt_identity()
    user = db.session.query(User).filter_by(email=current_user_email).first()
    if user:
        property = db.session.query(Property).filter_by(id=property_id, owner_id=user.id).first()
        if property:
            data = request.get_json()
            try:
                for key, value in data.items():
                    if hasattr(property, key):
                        setattr(property, key, value)
                db.session.commit()
                return jsonify({"message": "Property updated successfully"}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": str(e)}), 500
        return jsonify({"message": "Property not found"}), 404
    return jsonify({"message": "User not found"}), 404

@property_routes.route('/properties/<int:property_id>', methods=['DELETE'])
@jwt_required()
def delete_property(property_id):
    current_user_email = get_jwt_identity()
    user = db.session.query(User).filter_by(email=current_user_email).first()
    if user:
        property = db.session.query(Property).filter_by(id=property_id, owner_id=user.id).first()
        if property:
            try:
                db.session.delete(property)
                db.session.commit()
                return jsonify({"message": "Property deleted successfully"}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": str(e)}), 500
        return jsonify({"message": "Property not found"}), 404
    return jsonify({"message": "User not found"}), 404

# Phase routes
@property_routes.route('/phases/<int:property_id>', methods=['GET'])
@jwt_required()
def get_phases(property_id):
    phases = db.session.query(Phase).filter_by(property_id=property_id).all()
    return jsonify([phase.serialize() for phase in phases]), 200

@property_routes.route('/phases', methods=['POST'])
@jwt_required()
def add_phase():
    try:
        data = request.get_json()
        
        # Convert date strings to date objects
        date_fields = ['startDate', 'expectedStartDate', 'endDate', 'expectedEndDate']
        date_values = {}
        for field in date_fields:
            if data.get(field):
                try:
                    date_values[field] = datetime.fromisoformat(data[field]).date()
                except ValueError:
                    return jsonify({"error": f"Invalid date format for {field}"}), 400
            else:
                date_values[field] = None
        
        phase = Phase(
            property_id=data['property_id'],
            name=data['name'],
            startDate=date_values['startDate'],
            expectedStartDate=date_values['expectedStartDate'],
            endDate=date_values['endDate'],
            expectedEndDate=date_values['expectedEndDate']
        )
        
        db.session.add(phase)
        db.session.commit()
        return jsonify(phase.serialize()), 201
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@property_routes.route('/phases/<int:phase_id>', methods=['PUT'])
@jwt_required()
def update_phase(phase_id):
    phase = db.session.query(Phase).filter_by(id=phase_id).first()
    if not phase:
        return jsonify({"message": "Phase not found"}), 404
        
    try:
        data = request.get_json()
        
        # Convert date strings to date objects
        date_fields = ['startDate', 'expectedStartDate', 'endDate', 'expectedEndDate']
        for field in date_fields:
            if field in data:
                try:
                    if data[field] is not None:
                        data[field] = datetime.fromisoformat(data[field]).date()
                except ValueError:
                    return jsonify({"error": f"Invalid date format for {field}"}), 400
        
        for key, value in data.items():
            if hasattr(phase, key):
                setattr(phase, key, value)
                
        db.session.commit()
        return jsonify(phase.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@property_routes.route('/phases/<int:phase_id>', methods=['DELETE'])
@jwt_required()
def delete_phase(phase_id):
    phase = db.session.query(Phase).filter_by(id=phase_id).first()
    if not phase:
        return jsonify({"message": "Phase not found"}), 404
        
    try:
        db.session.delete(phase)
        db.session.commit()
        return jsonify({"message": "Phase deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@property_routes.route('/run-scraper', methods=['POST'])
@jwt_required()
def run_scraper_endpoint():
    """Run the foreclosure scraper and return results."""
    try:
        data = request.get_json() or {}
        county = data.get('county', 'Morris')  # Default to Morris County if not specified
        
        # Validate county
        from services.scraper.main import COUNTY_URLS
        if county not in COUNTY_URLS:
            return jsonify({
                'status': 'error',
                'error': f'Invalid county: {county}. Valid counties are: {", ".join(COUNTY_URLS.keys())}'
            }), 400
            
        success = run_scraper(county)
        if success:
            return jsonify({
                'status': 'success',
                'message': f'Scraper completed successfully for {county} County'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'error': f'Scraper failed to complete for {county} County'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@property_routes.route('/scraped-properties', methods=['GET'])
@jwt_required()
def get_scraped_properties():
    """Get the list of scraped properties from the merged data CSV."""
    try:
        # Path to the merged data file
        merged_data_path = os.path.join('services', 'scraper', 'downloads', 'merged_data.csv')
        
        if not os.path.exists(merged_data_path):
            return jsonify({
                'status': 'error',
                'message': 'No scraped data available. Please run the scraper first.'
            }), 404
            
        # Read the CSV file
        df = pd.read_csv(merged_data_path)
        
        # Convert DataFrame to list of dictionaries
        properties = df.to_dict('records')
        
        if not properties:
            return jsonify({
                'status': 'error',
                'message': 'No properties found in the scraped data.'
            }), 404
        
        return jsonify(properties), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@property_routes.route('/construction-draws/<int:draw_id>', methods=['DELETE'])
@jwt_required()
def delete_construction_draw(draw_id):
    try:
        draw = ConstructionDraw.query.get_or_404(draw_id)
        
        # Validate deletion
        draw.validate_for_deletion()
        
        db.session.delete(draw)
        db.session.commit()
        
        return jsonify({'message': 'Construction draw deleted successfully'}), 200
        
    except DrawSequenceError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@property_routes.route('/construction-draws', methods=['POST'])
@jwt_required()
def create_construction_draw():
    try:
        data = request.get_json()
        
        new_draw = ConstructionDraw(
            property_id=data['property_id'],
            release_date=datetime.strptime(data['release_date'], '%Y-%m-%d').date(),
            amount=float(data['amount']),
            bank_account_number=data.get('bank_account_number'),
            is_approved=data.get('is_approved', False)
        )
        
        # Validate creation
        new_draw.validate_for_creation()
        
        db.session.add(new_draw)
        db.session.commit()
        
        return jsonify(new_draw.to_dict()), 201
        
    except (DrawApprovalError, DrawSequenceError, DrawAmountError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@property_routes.route('/receipts', methods=['POST'])
@jwt_required()
def create_receipt():
    try:
        data = request.get_json()
        
        draw = ConstructionDraw.query.get_or_404(data['construction_draw_id'])
        
        new_receipt = Receipt(
            construction_draw_id=data['construction_draw_id'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            vendor=data['vendor'],
            amount=float(data['amount']),
            description=data['description'],
            pointofcontact=data.get('pointofcontact'),
            ccnumber=data.get('ccnumber')
        )
        
        # Validate receipt
        draw.validate_receipt(new_receipt)
        
        db.session.add(new_receipt)
        db.session.commit()
        
        return jsonify(new_receipt.to_dict()), 201
        
    except (ReceiptAmountError, ReceiptDateError, ReceiptDuplicateError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 