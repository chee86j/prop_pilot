from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import enum

# Initialize SQLAlchemy with no settings
db = SQLAlchemy()

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(512), nullable=False)
    last_name = db.Column(db.String(512), nullable=False)
    email = db.Column(db.String(512), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    properties = db.relationship('Property', backref='owner', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Property Model
class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) # Many to one relationship w/User
    # Location Section
    propertyName = db.Column(db.String(512))
    address = db.Column(db.String(1024))
    city = db.Column(db.String(512))
    state = db.Column(db.String(512))
    zipCode = db.Column(db.String(128))
    county = db.Column(db.String(512))
    bedroomsDescription = db.Column(db.String(512))
    bathroomsDescription = db.Column(db.String(512))
    kitchenDescription = db.Column(db.String(512))
    amenitiesDescription = db.Column(db.String(512))
    # Departments
    municipalBuildingAddress = db.Column(db.String(1024))
    buildingDepartmentContact = db.Column(db.String(512))
    electricDepartmentContact = db.Column(db.String(512))
    plumbingDepartmentContact = db.Column(db.String(512))
    fireDepartmentContact = db.Column(db.String(512))
    homeownersAssociationContact = db.Column(db.String(512))
    environmentalDepartmentContact = db.Column(db.String(512))
    # Total Outlay To Date
    purchaseCost = db.Column(db.Float)
    refinanceCosts = db.Column(db.Float)
    totalRehabCost = db.Column(db.Float)
    kickStartFunds = db.Column(db.Float)
    lenderConstructionDrawsReceived = db.Column(db.Float)
    utilitiesCost = db.Column(db.Float)
    yearlyPropertyTaxes = db.Column(db.Float)
    mortgagePaid = db.Column(db.Float)
    homeownersInsurance = db.Column(db.Float)
    expectedYearlyRent = db.Column(db.Float)
    rentalIncomeReceived = db.Column(db.Float)
    vacancyLoss = db.Column(db.Float)
    managementFees = db.Column(db.Float)
    maintenanceCosts = db.Column(db.Float)
    totalEquity = db.Column(db.Float)
    # Sale Projection
    arvSalePrice = db.Column(db.Float)
    realtorFees = db.Column(db.Float)
    propTaxtillEndOfYear = db.Column(db.Float)
    lenderLoanBalance = db.Column(db.Float)
    payOffStatement = db.Column(db.Float)
    attorneyFees = db.Column(db.Float)
    miscFees = db.Column(db.Float)
    utilities = db.Column(db.Float)
    cash2closeFromPurchase = db.Column(db.Float)
    cash2closeFromRefinance = db.Column(db.Float)
    totalRehabCosts = db.Column(db.Float)
    expectedRemainingRentEndToYear = db.Column(db.Float)
    totalExpenses = db.Column(db.Float)
    totalConstructionDrawsReceived = db.Column(db.Float)
    projectNetProfitIfSold = db.Column(db.Float)
    # Utility Information
    typeOfHeatingAndCooling = db.Column(db.String(512))
    waterCompany = db.Column(db.String(512))
    waterAccountNumber = db.Column(db.Float(32))
    electricCompany = db.Column(db.String(512))
    electricAccountNumber = db.Column(db.Float(32))
    gasOrOilCompany = db.Column(db.String(512))
    gasOrOilAccountNumber = db.Column(db.Float(32))
    sewerCompany = db.Column(db.String(512))
    sewerAccountNumber = db.Column(db.Float(32))
    # Key Players Information
    sellersAgent = db.Column(db.String(64))
    sellersBroker = db.Column(db.String(64))
    sellersAgentPhone = db.Column(db.String(64))
    sellersAttorney = db.Column(db.String(64))
    sellersAttorneyPhone = db.Column(db.String(64))
    escrowCompany = db.Column(db.String(128))
    escrowAgent = db.Column(db.String(64))
    escrowAgentPhone = db.Column(db.String(64))
    buyersAgent = db.Column(db.String(64))
    buyersBroker = db.Column(db.String(64))
    buyersAgentPhone = db.Column(db.String(64))
    buyersAttorney = db.Column(db.String(64))
    buyersAttorneyPhone = db.Column(db.String(64))
    titleInsuranceCompany = db.Column(db.String(128))
    titleAgent= db.Column(db.String(64))
    titleAgentPhone = db.Column(db.String(64))
    titlePhone = db.Column(db.String(64))
    appraisalCompany = db.Column(db.String(128))
    appraiser = db.Column(db.String(128))
    appraiserPhone = db.Column(db.String(64))
    surveyor = db.Column(db.String(128))
    surveyorPhone = db.Column(db.String(64))
    homeInspector = db.Column(db.String(128))
    homeInspectorPhone = db.Column(db.String(64))
    architect = db.Column(db.String(128))
    architectPhone = db.Column(db.String(64))
    # Lender Information
    lender = db.Column(db.String(128))
    lenderPhone = db.Column(db.String(64))
    refinanceLender = db.Column(db.String(128))
    refinanceLenderPhone = db.Column(db.String(64))
    loanOfficer = db.Column(db.String(128))
    loanOfficerPhone = db.Column(db.String(64))
    loanNumber = db.Column(db.String(64))
    # Sales & Marketing
    propertyManager = db.Column(db.String(128))
    propertyManagerPhone = db.Column(db.String(64))
    propertyManagementCompany = db.Column(db.String(128))
    propertyManagementPhone = db.Column(db.String(64))
    photographer = db.Column(db.String(128))
    photographerPhone = db.Column(db.String(64))
    videographer = db.Column(db.String(128))
    videographerPhone = db.Column(db.String(64))
    construction_draws = db.relationship('ConstructionDraw', backref='property', lazy='dynamic')

# Construct Draw Model
class ConstructionDraw(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id')) # Many to one relationship w/Property
    release_date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    bank_account_number = db.Column(db.String(256), nullable=False)
    is_approved = db.Column(db.Boolean, default=False, nullable=False)
    receipts = db.relationship('Receipt', backref='construction_draw', lazy='dynamic')

# Receipt Model
class Receipt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    construction_draw_id = db.Column(db.Integer, db.ForeignKey('construction_draw.id')) # Many to one relationship w/ConstructionDraw
    date = db.Column(db.Date, nullable=False)
    vendor = db.Column(db.String(512), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)
    pointofcontact = db.Column(db.String(512), nullable=True)
    ccnumber = db.Column(db.String(4), nullable=True)
