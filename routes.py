# this file contains api routes of this app
# it contains routes for user registration, login, profile, properties, construction draws, and receipts
# it also contains route to generate & verify JWT token

from flask import Blueprint, request, jsonify
from models import ConstructionDraw, Receipt, db, User, Property
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from datetime import timedelta

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
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

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
                'propertyName': property.propertyName,
                'address': property.address,
                'city': property.city,
                'state': property.state,
                'zipCode': property.zipCode,
                'county': property.county,
                'municipalBuildingAddress': property.municipalBuildingAddress,
                'buildingDepartmentContact': property.buildingDepartmentContact,
                'electricDepartmentContact': property.electricDepartmentContact,
                'plumbingDepartmentContact': property.plumbingDepartmentContact,
                'fireDepartmentContact': property.fireDepartmentContact,
                'environmentalDepartmentContact': property.environmentalDepartmentContact,
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
                'typeOfHeatingAndCooling': property.typeOfHeatingAndCooling,
                'waterCompany': property.waterCompany,
                'waterAccountNumber': property.waterAccountNumber,
                'electricCompany': property.electricCompany,
                'electricAccountNumber': property.electricAccountNumber,
                'gasOrOilCompany': property.gasOrOilCompany,
                'gasOrOilAccountNumber': property.gasOrOilAccountNumber,
                'sewerCompany': property.sewerCompany,
                'sewerAccountNumber': property.sewerAccountNumber
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
            'propertyName': property.propertyName,
            'address': property.address,
            'city': property.city,
            'state': property.state,
            'zipCode': property.zipCode,
            'county': property.county,
            'municipalBuildingAddress': property.municipalBuildingAddress,
            'buildingDepartmentContact': property.buildingDepartmentContact,
            'electricDepartmentContact': property.electricDepartmentContact,
            'plumbingDepartmentContact': property.plumbingDepartmentContact,
            'fireDepartmentContact': property.fireDepartmentContact,
            'environmentalDepartmentContact': property.environmentalDepartmentContact,
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
            'typeOfHeatingAndCooling': property.typeOfHeatingAndCooling,
            'waterCompany': property.waterCompany,
            'waterAccountNumber': property.waterAccountNumber,
            'electricCompany': property.electricCompany,
            'electricAccountNumber': property.electricAccountNumber,
            'gasOrOilCompany': property.gasOrOilCompany,
            'gasOrOilAccountNumber': property.gasOrOilAccountNumber,
            'sewerCompany': property.sewerCompany,
            'sewerAccountNumber': property.sewerAccountNumber
        } for property in properties]), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Add a new property
@api.route('/properties', methods=['POST'])
@jwt_required()
def add_property():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user:
        data = request.get_json()
        property = Property(
            user_id=user.id,
            propertyName=data['propertyName'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            zipCode=data['zipCode'],
            county=data['county'],
            municipalBuildingAddress=data['municipalBuildingAddress'],
            buildingDepartmentContact=data['buildingDepartmentContact'],
            electricDepartmentContact=data['electricDepartmentContact'],
            plumbingDepartmentContact=data['plumbingDepartmentContact'],
            fireDepartmentContact=data['fireDepartmentContact'],
            environmentalDepartmentContact=data['environmentalDepartmentContact'],
            purchaseCost=data['purchaseCost'],
            refinanceCosts=data['refinanceCosts'],
            totalRehabCost=data['totalRehabCost'],
            kickStartFunds=data['kickStartFunds'],
            lenderConstructionDrawsReceived=data['lenderConstructionDrawsReceived'],
            utilitiesCost=data['utilitiesCost'],
            yearlyPropertyTaxes=data['yearlyPropertyTaxes'],
            mortgagePaid=data['mortgagePaid'],
            homeownersInsurance=data['homeownersInsurance'],
            expectedYearlyRent=data['expectedYearlyRent'],
            rentalIncomeReceived=data['rentalIncomeReceived'],
            vacancyLoss=data['vacancyLoss'],
            managementFees=data['managementFees'],
            maintenanceCosts=data['maintenanceCosts'],
            totalEquity=data['totalEquity'],
            arvSalePrice=data['arvSalePrice'],
            realtorFees=data['realtorFees'],
            propTaxtillEndOfYear=data['propTaxtillEndOfYear'],
            lenderLoanBalance=data['lenderLoanBalance'],
            payOffStatement=data['payOffStatement'],
            attorneyFees=data['attorneyFees'],
            miscFees=data['miscFees'],
            utilities=data['utilities'],
            cash2closeFromPurchase=data['cash2closeFromPurchase'],
            cash2closeFromRefinance=data['cash2closeFromRefinance'],
            totalRehabCosts=data['totalRehabCosts'],
            expectedRemainingRentEndToYear=data['expectedRemainingRentEndToYear'],
            totalExpenses=data['totalExpenses'],
            totalConstructionDrawsReceived=data['totalConstructionDrawsReceived'],
            projectNetProfitIfSold=data['projectNetProfitIfSold'],
            typeOfHeatingAndCooling=data['typeOfHeatingAndCooling'],
            waterCompany=data['waterCompany'],
            waterAccountNumber=data['waterAccountNumber'],
            electricCompany=data['electricCompany'],
            electricAccountNumber=data['electricAccountNumber'],
            gasOrOilCompany=data['gasOrOilCompany'],
            gasOrOilAccountNumber=data['gasOrOilAccountNumber'],
            sewerCompany=data['sewerCompany'],
            sewerAccountNumber=data['sewerAccountNumber']
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
            property_to_update.propertyName = data.get('propertyName', property_to_update.propertyName)
            property_to_update.address = data.get('address', property_to_update.address)
            property_to_update.city = data.get('city', property_to_update.city)
            property_to_update.state = data.get('state', property_to_update.state)
            property_to_update.zipCode = data.get('zipCode', property_to_update.zipCode)
            property_to_update.county = data.get('county', property_to_update.county)
            property_to_update.municipalBuildingAddress = data.get('municipalBuildingAddress', property_to_update.municipalBuildingAddress)
            property_to_update.buildingDepartmentContact = data.get('buildingDepartmentContact', property_to_update.buildingDepartmentContact)
            property_to_update.electricDepartmentContact = data.get('electricDepartmentContact', property_to_update.electricDepartmentContact)
            property_to_update.plumbingDepartmentContact = data.get('plumbingDepartmentContact', property_to_update.plumbingDepartmentContact)
            property_to_update.fireDepartmentContact = data.get('fireDepartmentContact', property_to_update.fireDepartmentContact)
            property_to_update.environmentalDepartmentContact = data.get('environmentalDepartmentContact', property_to_update.environmentalDepartmentContact)
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
            property_to_update.typeOfHeatingAndCooling = data.get('typeOfHeatingAndCooling', property_to_update.typeOfHeatingAndCooling)
            property_to_update.waterCompany = data.get('waterCompany', property_to_update.waterCompany)
            property_to_update.waterAccountNumber = data.get('waterAccountNumber', property_to_update.waterAccountNumber)
            property_to_update.electricCompany = data.get('electricCompany', property_to_update.electricCompany)
            property_to_update.electricAccountNumber = data.get('electricAccountNumber', property_to_update.electricAccountNumber)
            property_to_update.gasOrOilCompany = data.get('gasOrOilCompany', property_to_update.gasOrOilCompany)
            property_to_update.gasOrOilAccountNumber = data.get('gasOrOilAccountNumber', property_to_update.gasOrOilAccountNumber)
            property_to_update.sewerCompany = data.get('sewerCompany', property_to_update.sewerCompany)
            property_to_update.sewerAccountNumber = data.get('sewerAccountNumber', property_to_update.sewerAccountNumber)
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

if __name__ == '__main__':
    app.run(debug=True)
    
