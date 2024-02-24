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
    propertyName = db.Column(db.String(512))
    address = db.Column(db.String(1024))
    city = db.Column(db.String(512))
    state = db.Column(db.String(512))
    zipCode = db.Column(db.String(128))
    county = db.Column(db.String(512))
    municipalBuildingAddress = db.Column(db.String(1024))
    buildingDepartmentContact = db.Column(db.String(512))
    electricDepartmentContact = db.Column(db.String(512))
    plumbingDepartmentContact = db.Column(db.String(512))
    fireDepartmentContact = db.Column(db.String(512))
    environmentalDepartmentContact = db.Column(db.String(512))
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
