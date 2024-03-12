# this file contains api routes of this app
# it contains routes for user registration, login, profile, properties, construction draws, and receipts
# it also contains route to generate & verify JWT token

from flask import Blueprint, request, jsonify
from models import ConstructionDraw, Phase, Receipt, db, User, Property
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from datetime import timedelta
from sqlalchemy.exc import IntegrityError

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
        return jsonify([phase.serialize() for phase in phases]), 200
    except Exception as e:
        # Handle the exception and return an appropriate response
        return jsonify({'error': str(e)}), 500

# Add a new phase for a property
@api.route('/phases', methods=['POST'])
@jwt_required()
def add_phase():
    data = request.get_json()
    phase = Phase(**data)
    db.session.add(phase)
    db.session.commit()
    return jsonify(phase.serialize()), 201

# Update a phase
@api.route('/phases/<int:phase_id>', methods=['PUT'])
@jwt_required()
def update_phase(phase_id):
    phase = Phase.query.get_or_404(phase_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(phase, key, value)
    db.session.commit()
    return jsonify(phase.serialize()), 200

# Delete a phase
@api.route('/phases/<int:phase_id>', methods=['DELETE'])
@jwt_required()
def delete_phase(phase_id):
    phase = Phase.query.get_or_404(phase_id)
    db.session.delete(phase)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
    
