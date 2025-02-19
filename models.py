from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import enum
from sqlalchemy import Index

# Initialize SQLAlchemy with no settings
db = SQLAlchemy()

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(512), nullable=False)
    last_name = db.Column(db.String(512), nullable=False)
    email = db.Column(db.String(512), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    avatar = db.Column(db.Text, nullable=True) 
    properties = db.relationship('Property', backref='owner', lazy='dynamic') # User can own multiple properties
    managed_tenants = db.relationship('Tenant', backref='manager', lazy='dynamic') # User can be a landlord or manager who manages multiple tenants

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Property Model
# Future use of indexing when filtering or sorting on specific columns are needed
# idx_property_location = Index('idx_property_location', Property.city, Property.state, ...)
class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) # Many to one relationship w/User
    
    # Foreclosure Fields If Applicable
    detail_link = db.Column(db.String(1024))  
    property_id = db.Column(db.String(256))   
    sheriff_number = db.Column(db.String(256))
    status_date = db.Column(db.Date)
    plaintiff = db.Column(db.Text)            
    defendant = db.Column(db.Text)            
    zillow_url = db.Column(db.String(1024))  
    
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
        # Capital Expenditures
    totalRehabCost = db.Column(db.Float)
    equipmentCost = db.Column(db.Float)
    constructionCost = db.Column(db.Float)
    largeRepairsCost = db.Column(db.Float)
    renovationCost = db.Column(db.Float)
    
    kickStartFunds = db.Column(db.Float)
    lenderConstructionDrawsReceived = db.Column(db.Float)
    utilitiesCost = db.Column(db.Float)
    sewer = db.Column(db.Float)
    water = db.Column(db.Float)
    lawn = db.Column(db.Float)
    garbage = db.Column(db.Float)
    yearlyPropertyTaxes = db.Column(db.Float)
    mortgagePaid = db.Column(db.Float)
    homeownersInsurance = db.Column(db.Float)
    expectedYearlyRent = db.Column(db.Float)
    rentalIncomeReceived = db.Column(db.Float)
    numUnits = db.Column(db.Integer)
    vacancyRate = db.Column(db.Float)
    avgTenantStay = db.Column(db.Float)
    otherMonthlyIncome = db.Column(db.Float)
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
    cashFlow = db.Column(db.Float)
    cashRoi = db.Column(db.Float)
    rule2Percent = db.Column(db.Float)
    rule50Percent = db.Column(db.Float)
    financeAmount = db.Column(db.Float)
    purchaseCapRate = db.Column(db.Float)
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
    # Lender Information
    lender = db.Column(db.String(128))
    lenderPhone = db.Column(db.String(64))
    refinanceLender = db.Column(db.String(128))
    refinanceLenderPhone = db.Column(db.String(64))
    loanOfficer = db.Column(db.String(128))
    loanOfficerPhone = db.Column(db.String(64))
    loanNumber = db.Column(db.String(64))
    downPaymentPercentage = db.Column(db.Float)
    loanInterestRate = db.Column(db.Float)
    pmiPercentage = db.Column(db.Float)
    mortgageYears = db.Column(db.Integer)
    lenderPointsAmount = db.Column(db.Float)
    otherFees = db.Column(db.Float)
    # Sales & Marketing
    propertyManager = db.Column(db.String(128))
    propertyManagerPhone = db.Column(db.String(64))
    propertyManagementCompany = db.Column(db.String(128))
    propertyManagementPhone = db.Column(db.String(64))
    photographer = db.Column(db.String(128))
    photographerPhone = db.Column(db.String(64))
    videographer = db.Column(db.String(128))
    videographerPhone = db.Column(db.String(64))
    appraisalCompany = db.Column(db.String(128))
    appraiser = db.Column(db.String(128))
    appraiserPhone = db.Column(db.String(64))
    surveyor = db.Column(db.String(128))
    surveyorPhone = db.Column(db.String(64))
    homeInspector = db.Column(db.String(128))
    homeInspectorPhone = db.Column(db.String(64))
    architect = db.Column(db.String(128))
    architectPhone = db.Column(db.String(64))
    construction_draws = db.relationship('ConstructionDraw', backref='property', lazy='dynamic') # One to many relationship w/ConstructionDraw
    phases = db.relationship('Phase', backref='property', lazy='dynamic') # One to many relationship w/Phase
    leases = db.relationship('Lease', backref='property', lazy=True) # One to many relationship w/Lease
    maintenance_requests = db.relationship('PropertyMaintenanceRequest', backref='property', lazy=True) # One to many relationship w/PropertyMaintenanceRequest
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))  # Adding cascade so that if a user is deleted, all properties associated with that user are also deleted
    Index('idx_user_property', 'user_id')  # Indexing this column for faster retrieval 

# Phase Model
class Phase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'))
    name = db.Column(db.String(512), nullable=False)
    startDate = db.Column(db.Date, nullable=True)
    expectedStartDate = db.Column(db.Date, nullable=True)
    endDate = db.Column(db.Date, nullable=True)
    expectedEndDate = db.Column(db.Date, nullable=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "name": self.name,
            "startDate": self.startDate.isoformat() if self.startDate else None,
            "expectedStartDate": self.expectedStartDate.isoformat() if self.expectedStartDate else None,
            "endDate": self.endDate.isoformat() if self.endDate else None,
            "expectedEndDate": self.expectedEndDate.isoformat() if self.expectedEndDate else None
        }
    
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

# Tenant Model
class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    phoneNumber = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    dateOfBirth = db.Column(db.Date, nullable=False)
    occupation = db.Column(db.String(255), nullable=True)
    employerName = db.Column(db.String(255), nullable=True)
    professionalTitle = db.Column(db.String(255), nullable=True)
    creditScoreAtInitialApplication = db.Column(db.Integer)
    creditCheck1Complete = db.Column(db.Boolean)
    creditScoreAtLeaseRenewal = db.Column(db.Integer)
    creditCheck2Complete = db.Column(db.Boolean)
    guarantor = db.Column(db.String(255), nullable=True)
    petsAllowed = db.Column(db.Boolean, default=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id')) # Link back to the manager(user) who manages this tenant
    leases = db.relationship('Lease', backref='tenant', lazy=True) # One to many relationship w/Lease
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'))  # Cascade for if a user is deleted, the manager_id is set to NULL
    Index('idx_tenant_manager', 'manager_id')  # Index for manager queries to improve retrieval speed

# Lease Model
class Lease(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenantId = db.Column(db.Integer, db.ForeignKey('tenant.id', ondelete='CASCADE'), nullable=False) # Many to one relationship w/Tenant & cascade for if a tenant is deleted, the lease is also deleted
    propertyId = db.Column(db.Integer, db.ForeignKey('property.id', ondelete='CASCADE'), nullable=False) # Many to one relationship w/Property & cascade for if a property is deleted, the lease is also deleted
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)
    rentAmount = db.Column(db.Float, nullable=False)
    renewalCondition = db.Column(db.String(255), nullable=True)
    typeOfLease = db.Column(db.String(100), nullable=False) # Examples: "Fixed", "Month-to-Month", "Lease to Own", etc.
   

# Property Maintenance Request Model
class PropertyMaintenanceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    propertyId = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    tenantId = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(100), default='pending')
    timeToCompletion = db.Column(db.Integer)  # Time in hours
    createdAt = db.Column(db.DateTime, default=db.func.current_timestamp())
    updatedAt = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    tenant = db.relationship('Tenant', backref='maintenance_requests', lazy=True) # Many to one relationship w/Tenant

