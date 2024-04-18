# this file contains api routes of this app
# it contains routes for user registration, login, profile, properties, construction draws, and receipts
# it also contains route to generate & verify JWT token

from flask import Blueprint, request, jsonify
from models import ConstructionDraw, Phase, Receipt, db, User, Property, Lease, PropertyMaintenanceRequest, Tenant
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from datetime import timedelta
from sqlalchemy.exc import IntegrityError
from calculations import get_property_profit_loss

api = Blueprint('api', __name__)

# -----USER LOGIN & REGISTRATION ROUTES-----
# User registration route
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email']
    )
    user.set_password(data['password'])

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User Created successfully"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email Already registered"}), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An Error Occurred"}), 500

# User login route
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.email, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

# -----USER PROFILE ROUTES-----
# Get user profile route
@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        return jsonify(email=user.email, first_name=user.first_name, last_name=user.last_name), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Update user profile route
@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404

# -----PROPERTY ROUTES-----
# Fetch a single property by its ID
@api.route('/properties/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property(property_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        property = Property.query.filter_by(id=property_id, user_id=user.id).first()
        if property:
            return jsonify({
                'id': property.id,
                # Location Section
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
                # Departments
                'municipalBuildingAddress': property.municipalBuildingAddress,
                'buildingDepartmentContact': property.buildingDepartmentContact,
                'electricDepartmentContact': property.electricDepartmentContact,
                'plumbingDepartmentContact': property.plumbingDepartmentContact,
                'fireDepartmentContact': property.fireDepartmentContact,
                'homeownersAssociationContact': property.homeownersAssociationContact,
                'environmentalDepartmentContact': property.environmentalDepartmentContact,
                # Total Outlay To Date
                'purchaseCost': property.purchaseCost,
                'refinanceCosts': property.refinanceCosts,
                'totalRehabCost': property.totalRehabCost,
                'kickStartFunds': property.kickStartFunds,
                'lenderConstructionDrawsReceived': property.lenderConstructionDrawsReceived,
                'utilitiesCost': property.utilitiesCost,
                'yearlyPropertyTaxes': property.yearlyPropertyTaxes,
                'mortgagePaid': property.mortgagePaid,
                'homeownersInsurance': property.homeownersInsurance,
                'expectedYearlyRent': property.expectedYearlyRent,
                'rentalIncomeReceived': property.rentalIncomeReceived,
                'vacancyLoss': property.vacancyLoss,
                'managementFees': property.managementFees,
                'maintenanceCosts': property.maintenanceCosts,
                'totalEquity': property.totalEquity,
                # Sale Projection
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
                # Utilities
                'typeOfHeatingAndCooling': property.typeOfHeatingAndCooling,
                'waterCompany': property.waterCompany,
                'waterAccountNumber': property.waterAccountNumber,
                'electricCompany': property.electricCompany,
                'electricAccountNumber': property.electricAccountNumber,
                'gasOrOilCompany': property.gasOrOilCompany,
                'gasOrOilAccountNumber': property.gasOrOilAccountNumber,
                'sewerCompany': property.sewerCompany,
                'sewerAccountNumber': property.sewerAccountNumber,
                # Key Players Information
                'sellersAgent': property.sellersAgent,
                'sellersBroker': property.sellersBroker,
                'sellersAgentPhone': property.sellersAgentPhone,
                'sellersAttorney': property.sellersAttorney,
                'sellersAttorneyPhone': property.sellersAttorneyPhone,
                'escrowCompany': property.escrowCompany,
                'escrowAgent': property.escrowAgent,
                'escrowAgentPhone': property.escrowAgentPhone,
                'buyersAgent': property.buyersAgent,
                'buyersAgentPhone': property.buyersAgentPhone,
                'buyersAttorney': property.buyersAttorney,
                'buyersAttorneyPhone': property.buyersAttorneyPhone,
                'titleInsuranceCompany': property.titleInsuranceCompany,
                'titleAgent': property.titleAgent,
                'titleAgentPhone': property.titleAgentPhone,
                'titlePhone': property.titlePhone,
                'appraisalCompany': property.appraisalCompany,
                'appraiser': property.appraiser,
                'appraierPhone': property.appraiserPhone,
                'surveyor': property.surveyor,
                'surveyorPhone': property.surveyorPhone,
                'homeInspector': property.homeInspector,
                'homeInspectorPhone': property.homeInspectorPhone,
                'architect': property.architect,
                'architectPhone': property.architectPhone,
                # Lender Information
                'lender': property.lender,
                'lenderPhone': property.lenderPhone,
                'refinanceLender': property.refinanceLender,
                'refinanceLenderPhone': property.refinanceLenderPhone,
                'loanOfficer': property.loanOfficer,
                'loanOfficerPhone': property.loanOfficerPhone,
                'loanNumber': property.loanNumber,
                # Sales & Marketing
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
                'appraierPhone': property.appraiserPhone,
                'surveyor': property.surveyor,
                'surveyorPhone': property.surveyorPhone,
                'homeInspector': property.homeInspector,
                'homeInspectorPhone': property.homeInspectorPhone,
                'architect': property.architect,
                'architectPhone': property.architectPhone,
            }), 200
        else:
            return jsonify({"message": "Property not found or access denied"}), 403
    else:
        return jsonify({"message": "User not found"}), 404


# Get all properties of the current user
@api.route('/properties', methods=['GET'])
@jwt_required()
def get_properties():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        properties = Property.query.filter_by(user_id=user.id).all()
        return jsonify([{
            'id': property.id,
                # Location Section
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
                # Departments
                'municipalBuildingAddress': property.municipalBuildingAddress,
                'buildingDepartmentContact': property.buildingDepartmentContact,
                'electricDepartmentContact': property.electricDepartmentContact,
                'plumbingDepartmentContact': property.plumbingDepartmentContact,
                'fireDepartmentContact': property.fireDepartmentContact,
                'homeownersAssociationContact': property.homeownersAssociationContact,
                'environmentalDepartmentContact': property.environmentalDepartmentContact,
                # Total Outlay To Date
                'purchaseCost': property.purchaseCost,
                'refinanceCosts': property.refinanceCosts,
                'totalRehabCost': property.totalRehabCost,
                'kickStartFunds': property.kickStartFunds,
                'lenderConstructionDrawsReceived': property.lenderConstructionDrawsReceived,
                'utilitiesCost': property.utilitiesCost,
                'yearlyPropertyTaxes': property.yearlyPropertyTaxes,
                'mortgagePaid': property.mortgagePaid,
                'homeownersInsurance': property.homeownersInsurance,
                'expectedYearlyRent': property.expectedYearlyRent,
                'rentalIncomeReceived': property.rentalIncomeReceived,
                'vacancyLoss': property.vacancyLoss,
                'managementFees': property.managementFees,
                'maintenanceCosts': property.maintenanceCosts,
                'totalEquity': property.totalEquity,
                # Sale Projection
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
                # Utilities
                'typeOfHeatingAndCooling': property.typeOfHeatingAndCooling,
                'waterCompany': property.waterCompany,
                'waterAccountNumber': property.waterAccountNumber,
                'electricCompany': property.electricCompany,
                'electricAccountNumber': property.electricAccountNumber,
                'gasOrOilCompany': property.gasOrOilCompany,
                'gasOrOilAccountNumber': property.gasOrOilAccountNumber,
                'sewerCompany': property.sewerCompany,
                'sewerAccountNumber': property.sewerAccountNumber,
                # Key Players Information
                'sellersAgent': property.sellersAgent,
                'sellersBroker': property.sellersBroker,
                'sellersAgentPhone': property.sellersAgentPhone,
                'sellersAttorney': property.sellersAttorney,
                'sellersAttorneyPhone': property.sellersAttorneyPhone,
                'escrowCompany': property.escrowCompany,
                'escrowAgent': property.escrowAgent,
                'escrowAgentPhone': property.escrowAgentPhone,
                'buyersAgent': property.buyersAgent,
                'buyersAgentPhone': property.buyersAgentPhone,
                'buyersAttorney': property.buyersAttorney,
                'buyersAttorneyPhone': property.buyersAttorneyPhone,
                'titleInsuranceCompany': property.titleInsuranceCompany,
                'titleAgent': property.titleAgent,
                'titleAgentPhone': property.titleAgentPhone,
                'titlePhone': property.titlePhone,
                # Lender Information
                'lender': property.lender,
                'lenderPhone': property.lenderPhone,
                'refinanceLender': property.refinanceLender,
                'refinanceLenderPhone': property.refinanceLenderPhone,
                'loanOfficer': property.loanOfficer,
                'loanOfficerPhone': property.loanOfficerPhone,
                'loanNumber': property.loanNumber,
                # Sales & Marketing
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
                'appraierPhone': property.appraiserPhone,
                'surveyor': property.surveyor,
                'surveyorPhone': property.surveyorPhone,
                'homeInspector': property.homeInspector,
                'homeInspectorPhone': property.homeInspectorPhone,
                'architect': property.architect,
                'architectPhone': property.architectPhone,
        } for property in properties]), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Convert a value to float to handle numeric fields, ensuring 
# that any non-numeric input (like an empty string) is converted 
# to a default float value (0.0).
def convert_to_float(value, default=0.0):
    try:
        return float(value)
    except ValueError:
        return default

# Add a new property for the current user
@api.route('/properties', methods=['POST'])
@jwt_required()
def add_property():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()

        if 'propertyName' not in data or not data['propertyName']:
            return jsonify({"error": "Property Name is Required at the Minimum"}), 400

        property = Property(
            user_id=user.id,
            # Location Section
            propertyName=data['propertyName'],
            address=data.get('address', ''),
            city=data.get('city', ''),
            state=data.get('state', ''),
            zipCode=data.get('zipCode', ''),
            county=data.get('county', ''),
            bedroomsDescription=data.get('bedroomsDescription', ''),
            bathroomsDescription=data.get('bathroomsDescription', ''),
            kitchenDescription=data.get('kitchenDescription', ''),
            amenitiesDescription=data.get('amenitiesDescription', ''),
            # Departments
            municipalBuildingAddress=data.get('municipalBuildingAddress', ''),
            buildingDepartmentContact=data.get('buildingDepartmentContact', ''),
            electricDepartmentContact=data.get('electricDepartmentContact', ''),
            plumbingDepartmentContact=data.get('plumbingDepartmentContact', ''),
            fireDepartmentContact=data.get('fireDepartmentContact', ''),
            homeownersAssociationContact=data.get('homeownersAssociationContact', ''),
            environmentalDepartmentContact=data.get('environmentalDepartmentContact', ''),
            # Total Outlay To Date
            purchaseCost=convert_to_float(data.get('purchaseCost')),
            refinanceCosts=convert_to_float(data.get('refinanceCosts')),
            totalRehabCost=convert_to_float(data.get('totalRehabCost')),
            kickStartFunds=convert_to_float(data.get('kickStartFunds')),
            lenderConstructionDrawsReceived=convert_to_float(data.get('lenderConstructionDrawsReceived')),
            utilitiesCost=convert_to_float(data.get('utilitiesCost')),
            yearlyPropertyTaxes=convert_to_float(data.get('yearlyPropertyTaxes')),
            mortgagePaid=convert_to_float(data.get('mortgagePaid')),
            homeownersInsurance=convert_to_float(data.get('homeownersInsurance')),
            expectedYearlyRent=convert_to_float(data.get('expectedYearlyRent')),
            rentalIncomeReceived=convert_to_float(data.get('rentalIncomeReceived')),
            vacancyLoss=convert_to_float(data.get('vacancyLoss')),
            managementFees=convert_to_float(data.get('managementFees')),
            maintenanceCosts=convert_to_float(data.get('maintenanceCosts')),
            totalEquity=convert_to_float(data.get('totalEquity')),
            # Sale Projection
            arvSalePrice=convert_to_float(data.get('arvSalePrice')),
            realtorFees=convert_to_float(data.get('realtorFees')),
            propTaxtillEndOfYear=convert_to_float(data.get('propTaxtillEndOfYear')),
            lenderLoanBalance=convert_to_float(data.get('lenderLoanBalance')),
            payOffStatement=convert_to_float(data.get('payOffStatement')),
            attorneyFees=convert_to_float(data.get('attorneyFees')),
            miscFees=convert_to_float(data.get('miscFees')),
            utilities=convert_to_float(data.get('utilities')),
            cash2closeFromPurchase=convert_to_float(data.get('cash2closeFromPurchase')),
            cash2closeFromRefinance=convert_to_float(data.get('cash2closeFromRefinance')),
            totalRehabCosts=convert_to_float(data.get('totalRehabCosts')),
            expectedRemainingRentEndToYear=convert_to_float(data.get('expectedRemainingRentEndToYear')),
            totalExpenses=convert_to_float(data.get('totalExpenses')),
            totalConstructionDrawsReceived=convert_to_float(data.get('totalConstructionDrawsReceived')),
            projectNetProfitIfSold=convert_to_float(data.get('projectNetProfitIfSold')),
            # Utilities
            typeOfHeatingAndCooling=data.get('typeOfHeatingAndCooling', ''),
            waterCompany=data.get('waterCompany', ''),
            waterAccountNumber=convert_to_float(data.get('waterAccountNumber', '')),
            electricCompany=data.get('electricCompany', ''),
            electricAccountNumber=convert_to_float(data.get('electricAccountNumber', '')),
            gasOrOilCompany=data.get('gasOrOilCompany', ''),
            gasOrOilAccountNumber=convert_to_float(data.get('gasOrOilAccountNumber', '')),
            sewerCompany=data.get('sewerCompany', ''),
            sewerAccountNumber=convert_to_float(data.get('sewerAccountNumber', '')),
            # Key Players Information
            sellersAgent=data.get('sellersAgent', ''),
            sellersBroker=data.get('sellersBroker', ''),
            sellersAgentPhone=data.get('sellersAgentPhone', ''),
            sellersAttorney=data.get('sellersAttorney', ''),
            sellersAttorneyPhone=data.get('sellersAttorneyPhone', ''),
            escrowCompany=data.get('escrowCompany', ''),
            escrowAgent=data.get('escrowAgent', ''),
            escrowAgentPhone=data.get('escrowAgentPhone', ''),
            buyersAgent=data.get('buyersAgent', ''),
            buyersAgentPhone=data.get('buyersAgentPhone', ''),
            buyersAttorney=data.get('buyersAttorney', ''),
            buyersAttorneyPhone=data.get('buyersAttorneyPhone', ''),
            titleInsuranceCompany=data.get('titleInsuranceCompany', ''),
            titleAgent=data.get('titleAgent', ''),
            titleAgentPhone=data.get('titleAgentPhone', ''),
            titlePhone=data.get('titlePhone', ''),
            # Lender Information
            lender=data.get('lender', ''),
            lenderPhone=data.get('lenderPhone', ''),
            refinanceLender=data.get('refinanceLender', ''),
            refinanceLenderPhone=data.get('refinanceLenderPhone', ''),
            loanOfficer=data.get('loanOfficer', ''),
            loanOfficerPhone=data.get('loanOfficerPhone', ''),
            loanNumber=data.get('loanNumber', ''),
            # Sales & Marketing
            propertyManager=data.get('propertyManager', ''),
            propertyManagerPhone=data.get('propertyManagerPhone', ''),
            propertyManagementCompany=data.get('propertyManagementCompany', ''),
            propertyManagementPhone=data.get('propertyManagementPhone', ''),
            photographer=data.get('photographer', ''),
            photographerPhone=data.get('photographerPhone', ''),
            videographer=data.get('videographer', ''),
            videographerPhone=data.get('videographerPhone', ''),
            appraisalCompany=data.get('appraisalCompany', ''),
            appraiser=data.get('appraiser', ''),
            appraiserPhone=data.get('appraiserPhone', ''),
            surveyor=data.get('surveyor', ''),
            surveyorPhone=data.get('surveyorPhone', ''),
            homeInspector=data.get('homeInspector', ''),
            homeInspectorPhone=data.get('homeInspectorPhone', ''),
            architect=data.get('architect', ''),
            architectPhone=data.get('architectPhone', ''),
        )

        db.session.add(property)
        db.session.commit()
        return jsonify({"message": "Property added successfully"}), 201
    else:
        return jsonify({"message": "User not found"}), 404


# Update a property of the current user
@api.route('/properties/<int:property_id>', methods=['PUT'])
@jwt_required()
def update_property(property_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        property_to_update = Property.query.filter_by(id=property_id, user_id=user.id).first()
        if property_to_update:
            data = request.get_json()
            # Location Section
            property_to_update.propertyName = data.get('propertyName', property_to_update.propertyName)
            property_to_update.address = data.get('address', property_to_update.address)
            property_to_update.city = data.get('city', property_to_update.city)
            property_to_update.state = data.get('state', property_to_update.state)
            property_to_update.zipCode = data.get('zipCode', property_to_update.zipCode)
            property_to_update.county = data.get('county', property_to_update.county)
            property_to_update.bedroomsDescription = data.get('bedroomsDescription', property_to_update.bedroomsDescription)
            property_to_update.bathroomsDescription = data.get('bathroomsDescription', property_to_update.bathroomsDescription)
            property_to_update.kitchenDescription = data.get('kitchenDescription', property_to_update.kitchenDescription)
            property_to_update.amenitiesDescription = data.get('amenitiesDescription', property_to_update.amenitiesDescription)
            # Departments
            property_to_update.municipalBuildingAddress = data.get('municipalBuildingAddress', property_to_update.municipalBuildingAddress)
            property_to_update.buildingDepartmentContact = data.get('buildingDepartmentContact', property_to_update.buildingDepartmentContact)
            property_to_update.electricDepartmentContact = data.get('electricDepartmentContact', property_to_update.electricDepartmentContact)
            property_to_update.plumbingDepartmentContact = data.get('plumbingDepartmentContact', property_to_update.plumbingDepartmentContact)
            property_to_update.fireDepartmentContact = data.get('fireDepartmentContact', property_to_update.fireDepartmentContact)
            property_to_update.homeownersAssociationContact = data.get('homeownersAssociationContact', property_to_update.homeownersAssociationContact)
            property_to_update.environmentalDepartmentContact = data.get('environmentalDepartmentContact', property_to_update.environmentalDepartmentContact)
            # Total Outlay To Date
            property_to_update.purchaseCost = data.get('purchaseCost', property_to_update.purchaseCost)
            property_to_update.refinanceCosts = data.get('refinanceCosts', property_to_update.refinanceCosts)
            property_to_update.totalRehabCost = data.get('totalRehabCost', property_to_update.totalRehabCost)
            property_to_update.kickStartFunds = data.get('kickStartFunds', property_to_update.kickStartFunds)
            property_to_update.lenderConstructionDrawsReceived = data.get('lenderConstructionDrawsReceived', property_to_update.lenderConstructionDrawsReceived)
            property_to_update.utilitiesCost = data.get('utilitiesCost', property_to_update.utilitiesCost)
            property_to_update.yearlyPropertyTaxes = data.get('yearlyPropertyTaxes', property_to_update.yearlyPropertyTaxes)
            property_to_update.mortgagePaid = data.get('mortgagePaid', property_to_update.mortgagePaid)
            property_to_update.homeownersInsurance = data.get('homeownersInsurance', property_to_update.homeownersInsurance)
            property_to_update.expectedYearlyRent = data.get('expectedYearlyRent', property_to_update.expectedYearlyRent)
            property_to_update.rentalIncomeReceived = data.get('rentalIncomeReceived', property_to_update.rentalIncomeReceived)
            property_to_update.vacancyLoss = data.get('vacancyLoss', property_to_update.vacancyLoss)
            property_to_update.managementFees = data.get('managementFees', property_to_update.managementFees)
            property_to_update.maintenanceCosts = data.get('maintenanceCosts', property_to_update.maintenanceCosts)
            property_to_update.totalEquity = data.get('totalEquity', property_to_update.totalEquity)
            # Sale Projection
            property_to_update.arvSalePrice = data.get('arvSalePrice', property_to_update.arvSalePrice)
            property_to_update.realtorFees = data.get('realtorFees', property_to_update.realtorFees)
            property_to_update.propTaxtillEndOfYear = data.get('propTaxtillEndOfYear', property_to_update.propTaxtillEndOfYear)
            property_to_update.lenderLoanBalance = data.get('lenderLoanBalance', property_to_update.lenderLoanBalance)
            property_to_update.payOffStatement = data.get('payOffStatement', property_to_update.payOffStatement)
            property_to_update.attorneyFees = data.get('attorneyFees', property_to_update.attorneyFees)
            property_to_update.miscFees = data.get('miscFees', property_to_update.miscFees)
            property_to_update.utilities = data.get('utilities', property_to_update.utilities)
            property_to_update.cash2closeFromPurchase = data.get('cash2closeFromPurchase', property_to_update.cash2closeFromPurchase)
            property_to_update.cash2closeFromRefinance = data.get('cash2closeFromRefinance', property_to_update.cash2closeFromRefinance)
            property_to_update.totalRehabCosts = data.get('totalRehabCosts', property_to_update.totalRehabCosts)
            property_to_update.expectedRemainingRentEndToYear = data.get('expectedRemainingRentEndToYear', property_to_update.expectedRemainingRentEndToYear)
            property_to_update.totalExpenses = data.get('totalExpenses', property_to_update.totalExpenses)
            property_to_update.totalConstructionDrawsReceived = data.get('totalConstructionDrawsReceived', property_to_update.totalConstructionDrawsReceived)
            property_to_update.projectNetProfitIfSold = data.get('projectNetProfitIfSold', property_to_update.projectNetProfitIfSold)
            # Utilities
            property_to_update.typeOfHeatingAndCooling = data.get('typeOfHeatingAndCooling', property_to_update.typeOfHeatingAndCooling)
            property_to_update.waterCompany = data.get('waterCompany', property_to_update.waterCompany)
            property_to_update.waterAccountNumber = data.get('waterAccountNumber', property_to_update.waterAccountNumber)
            property_to_update.electricCompany = data.get('electricCompany', property_to_update.electricCompany)
            property_to_update.electricAccountNumber = data.get('electricAccountNumber', property_to_update.electricAccountNumber)
            property_to_update.gasOrOilCompany = data.get('gasOrOilCompany', property_to_update.gasOrOilCompany)
            property_to_update.gasOrOilAccountNumber = data.get('gasOrOilAccountNumber', property_to_update.gasOrOilAccountNumber)
            property_to_update.sewerCompany = data.get('sewerCompany', property_to_update.sewerCompany)
            property_to_update.sewerAccountNumber = data.get('sewerAccountNumber', property_to_update.sewerAccountNumber)
            # Key Players Information
            property_to_update.sellersAgent = data.get('sellersAgent', property_to_update.sellersAgent)
            property_to_update.sellersBroker = data.get('sellersBroker', property_to_update.sellersBroker)
            property_to_update.sellersAgentPhone = data.get('sellersAgentPhone', property_to_update.sellersAgentPhone)
            property_to_update.sellersAttorney = data.get('sellersAttorney', property_to_update.sellersAttorney)
            property_to_update.sellersAttorneyPhone = data.get('sellersAttorneyPhone', property_to_update.sellersAttorneyPhone)
            property_to_update.escrowCompany = data.get('escrowCompany', property_to_update.escrowCompany)
            property_to_update.escrowAgent = data.get('escrowAgent', property_to_update.escrowAgent)
            property_to_update.escrowAgentPhone = data.get('escrowAgentPhone', property_to_update.escrowAgentPhone)
            property_to_update.buyersAgent = data.get('buyersAgent', property_to_update.buyersAgent)
            property_to_update.buyersAgentPhone = data.get('buyersAgentPhone', property_to_update.buyersAgentPhone)
            property_to_update.buyersAttorney = data.get('buyersAttorney', property_to_update.buyersAttorney)
            property_to_update.buyersAttorneyPhone = data.get('buyersAttorneyPhone', property_to_update.buyersAttorneyPhone)
            property_to_update.titleInsuranceCompany = data.get('titleInsuranceCompany', property_to_update.titleInsuranceCompany)
            property_to_update.titleAgent = data.get('titleAgent', property_to_update.titleAgent)
            property_to_update.titleAgentPhone = data.get('titleAgentPhone', property_to_update.titleAgentPhone)
            property_to_update.titlePhone = data.get('titlePhone', property_to_update.titlePhone)
            # Lender Information
            property_to_update.lender = data.get('lender', property_to_update.lender)
            property_to_update.lenderPhone = data.get('lenderPhone', property_to_update.lenderPhone)
            property_to_update.refinanceLender = data.get('refinanceLender', property_to_update.refinanceLender)
            property_to_update.refinanceLenderPhone = data.get('refinanceLenderPhone', property_to_update.refinanceLenderPhone)
            property_to_update.loanOfficer = data.get('loanOfficer', property_to_update.loanOfficer)
            property_to_update.loanOfficerPhone = data.get('loanOfficerPhone', property_to_update.loanOfficerPhone)
            property_to_update.loanNumber = data.get('loanNumber', property_to_update.loanNumber)
            # Sales & Marketing
            property_to_update.propertyManager = data.get('propertyManager', property_to_update.propertyManager)
            property_to_update.propertyManagerPhone = data.get('propertyManagerPhone', property_to_update.propertyManagerPhone)
            property_to_update.propertyManagementCompany = data.get('propertyManagementCompany', property_to_update.propertyManagementCompany)
            property_to_update.propertyManagementPhone = data.get('propertyManagementPhone', property_to_update.propertyManagementPhone)
            property_to_update.photographer = data.get('photographer', property_to_update.photographer)
            property_to_update.photographerPhone = data.get('photographerPhone', property_to_update.photographerPhone)
            property_to_update.videographer = data.get('videographer', property_to_update.videographer)
            property_to_update.videographerPhone = data.get('videographerPhone', property_to_update.videographerPhone)
            property_to_update.appraisalCompany = data.get('appraisalCompany', property_to_update.appraisalCompany)
            property_to_update.appraiser = data.get('appraiser', property_to_update.appraiser)
            property_to_update.appraiserPhone = data.get('appraiserPhone', property_to_update.appraiserPhone)
            property_to_update.surveyor = data.get('surveyor', property_to_update.surveyor)
            property_to_update.surveyorPhone = data.get('surveyorPhone', property_to_update.surveyorPhone)
            property_to_update.homeInspector = data.get('homeInspector', property_to_update.homeInspector)
            property_to_update.homeInspectorPhone = data.get('homeInspectorPhone', property_to_update.homeInspectorPhone)
            property_to_update.architect = data.get('architect', property_to_update.architect)
            property_to_update.architectPhone = data.get('architectPhone', property_to_update.architectPhone)
            db.session.commit()
            return jsonify({"message": "Property updated successfully"}), 200
        else:
            return jsonify({"message": "Property not found or access denied"}), 403
    else:
        return jsonify({"message": "User not found"}), 404

# Delete a property of the current user
@api.route('/properties/<int:property_id>', methods=['DELETE'])
@jwt_required()
def delete_property(property_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        property_to_delete = Property.query.filter_by(id=property_id, user_id=user.id).first()
        if property_to_delete:
            db.session.delete(property_to_delete)
            db.session.commit()
            return jsonify({"message": "Property deleted successfully"}), 200
        else:
            return jsonify({"message": "Property not found or access denied"}), 403
    else:
        return jsonify({"message": "User not found"}), 404
    
# -----CONSTRUCTION DRAW ROUTES-----
# Fetch a single construction draw by its ID
@api.route('/construction-draws/<int:property_id>', methods=['GET'])
@jwt_required()
def get_construction_draws(property_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        draws = ConstructionDraw.query.filter_by(property_id=property_id).all()
        draws_data = [{
            'id': draw.id,
            'release_date': draw.release_date,
            'amount': draw.amount,
            'bank_account_number': draw.bank_account_number,
            'is_approved': draw.is_approved
        } for draw in draws]
        return jsonify(draws_data), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Add a new construction draw for current user
@api.route('/construction-draws', methods=['POST'])
@jwt_required()
def add_construction_draw():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        new_draw = ConstructionDraw(
            property_id=data.get('property_id'),
            release_date=data.get('release_date'),
            amount=data.get('amount'),
            bank_account_number=data.get('bank_account_number'),
            is_approved=data.get('is_approved', False)
        )
        db.session.add(new_draw)
        db.session.commit()
        return jsonify({"message": "Construction draw created successfully", "id": new_draw.id}), 201
    else:
        return jsonify({"message": "User not found"}), 404


# Update a construction draw of current user 
@api.route('/construction-draws/<int:draw_id>', methods=['PUT'])
@jwt_required()
def update_construction_draw(draw_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        draw_to_update = ConstructionDraw.query.filter_by(id=draw_id).first()
        if draw_to_update:
            data = request.get_json()
            draw_to_update.release_date = data.get('release_date', draw_to_update.release_date)
            draw_to_update.amount = data.get('amount', draw_to_update.amount)
            draw_to_update.bank_account_number = data.get('bank_account_number', draw_to_update.bank_account_number)
            draw_to_update.is_approved = data.get('is_approved', draw_to_update.is_approved)
            db.session.commit()
            return jsonify({"message": "Construction draw updated successfully"}), 200
        else:
            return jsonify({"message": "Construction draw not found or access denied"}), 403
    else:
        return jsonify({"message": "User not found"}), 404
    
# Delete a construction draw of current user
@api.route('/construction-draws/<int:draw_id>', methods=['DELETE'])
@jwt_required()
def delete_construction_draw(draw_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        draw_to_delete = ConstructionDraw.query.filter_by(id=draw_id).first()
        if draw_to_delete:
            db.session.delete(draw_to_delete)
            db.session.commit()
            return jsonify({"message": "Construction draw deleted successfully"}), 200
        else:
            return jsonify({"message": "Construction draw not found or access denied"}), 403
    else:
        return jsonify({"message": "User not found"}), 404

    
# -----RECEIPT ROUTES-----
# Fetch a single receipt by its ID
@api.route('/receipts/<int:draw_id>', methods=['GET'])
@jwt_required()
def get_receipts(draw_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        receipts = Receipt.query.filter_by(construction_draw_id=draw_id).all()
        receipts_data = [{
            'id': receipt.id,
            'date': receipt.date,
            'vendor': receipt.vendor,
            'amount': receipt.amount,
            'description': receipt.description,
            'pointofcontact': receipt.pointofcontact,
            'ccnumber': receipt.ccnumber
        } for receipt in receipts]
        return jsonify(receipts_data), 200
    else:
        return jsonify({"message": "User not found"}), 404
    
# Add a new receipt for current user
def add_receipt():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        new_receipt = Receipt(
            construction_draw_id=data['construction_draw_id'],
            date=data['date'],
            vendor=data['vendor'],
            amount=data['amount'],
            description=data['description'],
            pointofcontact=data['pointofcontact'],
            ccnumber=data['ccnumber']
        )
        db.session.add(new_receipt)
        db.session.commit()
        return jsonify({"message": "Receipt added successfully", "id": new_receipt.id}), 201
    else:
        return jsonify({"message": "User not found"}), 404
    
# Add a receipt of current user
@api.route('/receipts', methods=['POST'])
@jwt_required()
def add_receipt():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        new_receipt = Receipt(
            construction_draw_id=data['construction_draw_id'],
            date=data['date'],
            vendor=data['vendor'],
            amount=data['amount'],
            description=data['description'],
            pointofcontact=data['pointofcontact'],
            ccnumber=data['ccnumber']
        )
        db.session.add(new_receipt)
        db.session.commit()
        return jsonify({"message": "Receipt added successfully", "id": new_receipt.id}), 201
    else:
        return jsonify({"message": "User not found"}), 404

    
# Update a receipt of current user
@api.route('/receipts/<int:receipt_id>', methods=['PUT'])
@jwt_required()
def update_receipt(receipt_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        receipt_to_update = Receipt.query.filter_by(id=receipt_id).first()
        if receipt_to_update:
            data = request.get_json()
            receipt_to_update.date = data.get('date', receipt_to_update.date)
            receipt_to_update.vendor = data.get('vendor', receipt_to_update.vendor)
            receipt_to_update.amount = data.get('amount', receipt_to_update.amount)
            receipt_to_update.description = data.get('description', receipt_to_update.description)
            receipt_to_update.pointofcontact = data.get('pointofcontact', receipt_to_update.pointofcontact)
            receipt_to_update.ccnumber = data.get('ccnumber', receipt_to_update.ccnumber)
            db.session.commit()
            return jsonify({"message": "Receipt updated successfully"}), 200
        else:
            return jsonify({"message": "Receipt not found or access denied"}), 403
    else:
        return jsonify({"message": "User not found"}), 404
    
# Delete a receipt of current user
@api.route('/receipts/<int:receipt_id>', methods=['DELETE'])
@jwt_required()
def delete_receipt(receipt_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        receipt_to_delete = Receipt.query.filter_by(id=receipt_id).first()
        if receipt_to_delete:
            db.session.delete(receipt_to_delete)
            db.session.commit()
            return jsonify({"message": "Receipt deleted successfully"}), 200
        else:
            return jsonify({"message": "Receipt not found or access denied"}), 403
    else:
        return jsonify({"message": "User not found"}), 404

# -----TIMELINE PHASE ROUTES-----
# Fetch all phases for a property
@api.route('/phases/<int:property_id>', methods=['GET'])
@jwt_required()
def get_phases(property_id):
    try:
        phases = Phase.query.filter_by(property_id=property_id).all()
        if not phases:
            return jsonify({"message": "No phases found for the given property"}), 404
        return jsonify([phase.serialize() for phase in phases]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch phases: ' + str(e)}), 500

# Add a new phase for a property
@api.route('/phases', methods=['POST'])
@jwt_required()
def add_phase():
    try:
        data = request.get_json()
        print(data)
        if not data.get('name'):
            return jsonify({"error": "Phase name is required"}), 400
        
        if 'property_id' not in data or not data['property_id']:
            return jsonify({"error": "property_id is required"}), 400
        
        # Add additional validations as needed
        
        phase = Phase(**data)
        db.session.add(phase)
        db.session.commit()
        return jsonify(phase.serialize()), 201
    
    except Exception as e:
        return jsonify({'error': 'Failed to add phase: ' + str(e)}), 500

# Update a phase
@api.route('/phases/<int:phase_id>', methods=['PUT'])
@jwt_required()
def update_phase(phase_id):
    try:
        phase = Phase.query.get_or_404(phase_id)
        data = request.get_json()
        for key, value in data.items():
            setattr(phase, key, value)
        db.session.commit()
        return jsonify(phase.serialize()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update phase: ' + str(e)}), 500

# Delete a phase
@api.route('/phases/<int:phase_id>', methods=['DELETE'])
@jwt_required()
def delete_phase(phase_id):
    try:
        phase = Phase.query.get_or_404(phase_id)
        db.session.delete(phase)
        db.session.commit()
        return '', 204
    except Exception as e:
        return jsonify({'error': 'Failed to delete phase: ' + str(e)}), 500


# -----TENANT ROUTES-----
# Fetch all tenants
@api.route('/tenants', methods=['GET'])
@jwt_required()
def get_all_tenants():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenants = Tenant.query.all()
        tenants_data = []
        for tenant in tenants:
            leases = [lease.serialize() for lease in tenant.leases]  # Serialize leases associated with the tenant
            tenant_data = {
                'id': tenant.id,
                'firstName': tenant.firstName,
                'lastName': tenant.lastName,
                'phoneNumber': tenant.phoneNumber,
                'email': tenant.email,
                'dateOfBirth': tenant.dateOfBirth,
                'occupation': tenant.occupation,
                'employerName': tenant.employerName,
                'professionalTitle': tenant.professionalTitle,
                'creditScoreAtInitialApplication': tenant.creditScoreAtInitialApplication,
                'creditCheck1Complete': tenant.creditCheck1Complete,
                'creditScoreAtLeaseRenewal': tenant.creditScoreAtLeaseRenewal,
                'creditCheck2Complete': tenant.creditCheck2Complete,
                'guarantor': tenant.guarantor,
                'petsAllowed': tenant.petsAllowed,
                'manager_id': tenant.manager_id,
                'leases': leases  # Include serialized leases in the tenant data
            }
            tenants_data.append(tenant_data)
        return jsonify(tenants_data), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Fetch a single tenant by their ID
@api.route('/tenants/<int:tenant_id>', methods=['GET'])
@jwt_required()
def get_tenant(tenant_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenant = Tenant.query.get(tenant_id)
        if tenant:
            leases = [lease.serialize() for lease in tenant.leases]  # Serialize leases associated with the tenant
            tenant_data = {
                'id': tenant.id,
                'firstName': tenant.firstName,
                'lastName': tenant.lastName,
                'phoneNumber': tenant.phoneNumber,
                'email': tenant.email,
                'dateOfBirth': tenant.dateOfBirth,
                'occupation': tenant.occupation,
                'employerName': tenant.employerName,
                'professionalTitle': tenant.professionalTitle,
                'creditScoreAtInitialApplication': tenant.creditScoreAtInitialApplication,
                'creditCheck1Complete': tenant.creditCheck1Complete,
                'creditScoreAtLeaseRenewal': tenant.creditScoreAtLeaseRenewal,
                'creditCheck2Complete': tenant.creditCheck2Complete,
                'guarantor': tenant.guarantor,
                'petsAllowed': tenant.petsAllowed,
                'manager_id': tenant.manager_id,
                'leases': leases  # Include serialized leases in the tenant data
            }
            return jsonify(tenant_data), 200
        else:
            return jsonify({"message": "Tenant not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# Add a new tenant
@api.route('/tenants', methods=['POST'])
@jwt_required()
def add_tenant():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        new_tenant = Tenant(
            firstName=data['firstName'],
            lastName=data['lastName'],
            phoneNumber=data['phoneNumber'],
            email=data['email'],
            dateOfBirth=data['dateOfBirth'],
            occupation=data['occupation'],
            employerName=data['employerName'],
            professionalTitle=data['professionalTitle'],
            creditScoreAtInitialApplication=data['creditScoreAtInitialApplication'],
            creditCheck1Complete=data['creditCheck1Complete'],
            creditScoreAtLeaseRenewal=data['creditScoreAtLeaseRenewal'],
            creditCheck2Complete=data['creditCheck2Complete'],
            guarantor=data['guarantor'],
            petsAllowed=data['petsAllowed'],
            manager_id=data['manager_id']
        )
        db.session.add(new_tenant)
        db.session.commit()
        return jsonify({"message": "Tenant added successfully", "id": new_tenant.id}), 201
    else:
        return jsonify({"message": "User not found"}), 404

# Update a tenant
@api.route('/tenants/<int:tenant_id>', methods=['PUT'])
@jwt_required()
def update_tenant(tenant_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenant_to_update = Tenant.query.get(tenant_id)
        if tenant_to_update:
            data = request.get_json()
            tenant_to_update.firstName = data.get('firstName', tenant_to_update.firstName)
            tenant_to_update.lastName = data.get('lastName', tenant_to_update.lastName)
            tenant_to_update.phoneNumber = data.get('phoneNumber', tenant_to_update.phoneNumber)
            tenant_to_update.email = data.get('email', tenant_to_update.email)
            tenant_to_update.dateOfBirth = data.get('dateOfBirth', tenant_to_update.dateOfBirth)
            tenant_to_update.occupation = data.get('occupation', tenant_to_update.occupation)
            tenant_to_update.employerName = data.get('employerName', tenant_to_update.employerName)
            tenant_to_update.professionalTitle = data.get('professionalTitle', tenant_to_update.professionalTitle)
            tenant_to_update.creditScoreAtInitialApplication = data.get('creditScoreAtInitialApplication', tenant_to_update.creditScoreAtInitialApplication)
            tenant_to_update.creditCheck1Complete = data.get('creditCheck1Complete', tenant_to_update.creditCheck1Complete)
            tenant_to_update.creditScoreAtLeaseRenewal = data.get('creditScoreAtLeaseRenewal', tenant_to_update.creditScoreAtLeaseRenewal)
            tenant_to_update.creditCheck2Complete = data.get('creditCheck2Complete', tenant_to_update.creditCheck2Complete)
            tenant_to_update.guarantor = data.get('guarantor', tenant_to_update.guarantor)
            tenant_to_update.petsAllowed = data.get('petsAllowed', tenant_to_update.petsAllowed)
            tenant_to_update.manager_id = data.get('manager_id', tenant_to_update.manager_id)
            db.session.commit()
            return jsonify({"message": "Tenant updated successfully"}), 200
        else:
            return jsonify({"message": "Tenant not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# Delete a tenant
@api.route('/tenants/<int:tenant_id>', methods=['DELETE'])
@jwt_required()
def delete_tenant(tenant_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        tenant_to_delete = Tenant.query.get(tenant_id)
        if tenant_to_delete:
            db.session.delete(tenant_to_delete)
            db.session.commit()
            return jsonify({"message": "Tenant deleted successfully"}), 200
        else:
            return jsonify({"message": "Tenant not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# -----LEASE ROUTES-----
# Fetch all leases for a property
@api.route('/leases/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property_leases(property_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        property = Property.query.get(property_id)
        if property:
            leases = Lease.query.filter_by(propertyId=property_id).all()
            lease_data = [{
                "id": lease.id,
                "tenant_id": lease.tenantId,
                "start_date": lease.startDate.isoformat(),
                "end_date": lease.endDate.isoformat(),
                "rent_amount": lease.rentAmount,
                "renewal_condition": lease.renewalCondition,
                "type_of_lease": lease.typeOfLease
            } for lease in leases]
            return jsonify(lease_data), 200
        else:
            return jsonify({"message": "Property not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404
    
# Fetch a single lease for a property
@api.route('/leases/<int:lease_id>', methods=['GET'])
@jwt_required()
def get_lease(lease_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        lease = Lease.query.get(lease_id)
        if lease:
            lease_data = {
                "id": lease.id,
                "property_id": lease.propertyId,
                "tenant_id": lease.tenantId,
                "start_date": lease.startDate.isoformat(),
                "end_date": lease.endDate.isoformat(),
                "rent_amount": lease.rentAmount,
                "renewal_condition": lease.renewalCondition,
                "type_of_lease": lease.typeOfLease
            }
            return jsonify(lease_data), 200
        else:
            return jsonify({"message": "Lease not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# Create a new lease for a property
@api.route('/leases', methods=['POST'])
@jwt_required()
def create_lease():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        new_lease = Lease(
            propertyId=data['property_id'],
            startDate=data['start_date'],
            endDate=data['end_date'],
            rentAmount=data['rent_amount'],
            renewalCondition=data.get('renewal_condition'),
            typeOfLease=data['type_of_lease'],
            tenantId=data['tenant_id']
        )
        db.session.add(new_lease)
        db.session.commit()
        return jsonify({"message": "Lease added successfully", "id": new_lease.id}), 201
    else:
        return jsonify({"message": "User not found"}), 404

# Update a lease for a property
@api.route('/leases/<int:lease_id>', methods=['PUT'])
@jwt_required()
def update_lease(lease_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        lease = Lease.query.get(lease_id)
        if lease:
            data = request.get_json()
            lease.startDate = data.get('start_date', lease.startDate)
            lease.endDate = data.get('end_date', lease.endDate)
            lease.rentAmount = data.get('rent_amount', lease.rentAmount)
            lease.renewalCondition = data.get('renewal_condition', lease.renewalCondition)
            lease.typeOfLease = data.get('type_of_lease', lease.typeOfLease)
            db.session.commit()
            return jsonify({"message": "Lease updated successfully"}), 200
        else:
            return jsonify({"message": "Lease not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# Delete a lease for a property
@api.route('/leases/<int:lease_id>', methods=['DELETE'])
@jwt_required()
def delete_lease(lease_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        lease = Lease.query.get(lease_id)
        if lease:
            db.session.delete(lease)
            db.session.commit()
            return jsonify({"message": "Lease deleted successfully"}), 200
        else:
            return jsonify({"message": "Lease not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# Property Maintenance Request Routes
# Fetch all property maintenance requests
@api.route('/property-maintenance-requests', methods=['GET'])
@jwt_required()
def get_property_maintenance_requests():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        maintenance_requests = PropertyMaintenanceRequest.query.all()
        maintenance_requests_data = [{
            'id': request.id,
            'property_id': request.propertyId,
            'tenant_id': request.tenantId,
            'description': request.description,
            'status': request.status,
            'time_to_completion': request.timeToCompletion,
            'created_at': request.createdAt.isoformat(),
            'updated_at': request.updatedAt.isoformat()
        } for request in maintenance_requests]
        return jsonify(maintenance_requests_data), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Fetch a single property maintenance request by its ID
@api.route('/property-maintenance-requests/<int:request_id>', methods=['GET'])
@jwt_required()
def get_property_maintenance_request(request_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        maintenance_request = PropertyMaintenanceRequest.query.get(request_id)
        if maintenance_request:
            request_data = {
                'id': maintenance_request.id,
                'property_id': maintenance_request.propertyId,
                'tenant_id': maintenance_request.tenantId,
                'description': maintenance_request.description,
                'status': maintenance_request.status,
                'time_to_completion': maintenance_request.timeToCompletion,
                'created_at': maintenance_request.createdAt.isoformat(),
                'updated_at': maintenance_request.updatedAt.isoformat()
            }
            return jsonify(request_data), 200
        else:
            return jsonify({"message": "Property maintenance request not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# Add a new property maintenance request
@api.route('/property-maintenance-requests', methods=['POST'])
@jwt_required()
def add_property_maintenance_request():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        new_request = PropertyMaintenanceRequest(
            propertyId=data['property_id'],
            tenantId=data['tenant_id'],
            description=data['description'],
            status=data.get('status', 'pending'),
            timeToCompletion=data.get('time_to_completion'),
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({"message": "Property maintenance request added successfully", "id": new_request.id}), 201
    else:
        return jsonify({"message": "User not found"}), 404

# Update a property maintenance request
@api.route('/property-maintenance-requests/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_property_maintenance_request(request_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        request_to_update = PropertyMaintenanceRequest.query.get(request_id)
        if request_to_update:
            data = request.get_json()
            request_to_update.propertyId = data['property_id']
            request_to_update.tenantId = data['tenant_id']
            request_to_update.description = data['description']
            request_to_update.status = data.get('status', request_to_update.status)
            request_to_update.timeToCompletion = data.get('time_to_completion', request_to_update.timeToCompletion)
            db.session.commit()
            return jsonify({"message": "Property maintenance request updated successfully"}), 200
        else:
            return jsonify({"message": "Property maintenance request not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404

# Delete a property maintenance request
@api.route('/property-maintenance-requests/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_property_maintenance_request(request_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        request_to_delete = PropertyMaintenanceRequest.query.get(request_id)
        if request_to_delete:
            db.session.delete(request_to_delete)
            db.session.commit()
            return jsonify({"message": "Property maintenance request deleted successfully"}), 200
        else:
            return jsonify({"message": "Property maintenance request not found"}), 404
    else:
        return jsonify({"message": "User not found"}), 404


# -----Routes for Calculations-----
# Calculate profit/loss for a property
@api.route('/properties/<int:property_id>/profit_loss', methods=['GET'])
@jwt_required()
def profit_loss(property_id):
    print(f"Accessing profit/loss data for property ID: {property_id}")
    try:
        result = get_property_profit_loss(property_id)
        if result:
            print("Data found:", result)
            return jsonify(result), 200
        else:
            print("No data found for the given property ID")
            return jsonify({"message": "Property not found"}), 404
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error. Please contact support."}), 500


if __name__ == '__main__':
    app.run(debug=True)
    


