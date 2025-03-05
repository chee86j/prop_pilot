from sqlalchemy import Index, event
from .base import db
from .tenant import ValidationError
from datetime import datetime

class Property(db.Model):
    """Property model representing real estate properties"""
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)
    current_phase = db.Column(db.String(50), nullable=False, default='ACQUISITION')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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
    titleAgent = db.Column(db.String(64))
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

    # Relationships
    owner = db.relationship('User', backref=db.backref('properties', lazy=True))
    phases = db.relationship('Phase', backref='property', lazy=True)
    leases = db.relationship('Lease', backref='property', lazy=True)
    maintenance_requests = db.relationship('PropertyMaintenanceRequest', backref='property', lazy=True)
    construction_draws = db.relationship('ConstructionDraw', backref='property', lazy=True)

    # Indexes
    __table_args__ = (Index('idx_user_property', 'owner_id'),)

    def __init__(self, address, owner_id, purchase_price, current_phase='ACQUISITION'):
        """Initialize a new property"""
        self.address = address
        self.owner_id = owner_id
        self.purchase_price = purchase_price
        self.current_phase = current_phase

    def validate_state(self):
        """Validate state code is 2 letters"""
        if self.state and (len(self.state) != 2 or not self.state.isalpha()):
            raise ValidationError("State must be a 2-letter code")

    def validate_zip_code(self):
        """Validate zip code format"""
        if self.zipCode and len(self.zipCode) != 5:
            raise ValidationError("Zip code must be 5 digits")

    def validate_costs(self):
        """Validate costs are not negative"""
        cost_fields = [
            'purchaseCost', 'totalRehabCost', 'equipmentCost', 'constructionCost',
            'largeRepairsCost', 'renovationCost', 'arvSalePrice'
        ]
        for field in cost_fields:
            value = getattr(self, field)
            if value is not None and value < 0:
                raise ValidationError(f"{field} cannot be negative")

    def serialize(self):
        """Convert the property object to a dictionary for JSON serialization"""
        return {
            'id': self.id,
            'address': self.address,
            'owner_id': self.owner_id,
            'purchase_price': self.purchase_price,
            'current_phase': self.current_phase,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'detail_link': self.detail_link,
            'property_id': self.property_id,
            'sheriff_number': self.sheriff_number,
            'status_date': self.status_date.isoformat() if self.status_date else None,
            'plaintiff': self.plaintiff,
            'defendant': self.defendant,
            'zillow_url': self.zillow_url,
            'propertyName': self.propertyName,
            'city': self.city,
            'state': self.state,
            'zipCode': self.zipCode,
            'county': self.county,
            'bedroomsDescription': self.bedroomsDescription,
            'bathroomsDescription': self.bathroomsDescription,
            'kitchenDescription': self.kitchenDescription,
            'amenitiesDescription': self.amenitiesDescription,
            'purchaseCost': self.purchaseCost,
            'refinanceCosts': self.refinanceCosts,
            'totalRehabCost': self.totalRehabCost,
            'equipmentCost': self.equipmentCost,
            'constructionCost': self.constructionCost,
            'largeRepairsCost': self.largeRepairsCost,
            'renovationCost': self.renovationCost,
            'kickStartFunds': self.kickStartFunds,
            'lenderConstructionDrawsReceived': self.lenderConstructionDrawsReceived,
            'utilitiesCost': self.utilitiesCost,
            'sewer': self.sewer,
            'water': self.water,
            'lawn': self.lawn,
            'garbage': self.garbage,
            'yearlyPropertyTaxes': self.yearlyPropertyTaxes,
            'mortgagePaid': self.mortgagePaid,
            'homeownersInsurance': self.homeownersInsurance,
            'expectedYearlyRent': self.expectedYearlyRent,
            'rentalIncomeReceived': self.rentalIncomeReceived,
            'numUnits': self.numUnits,
            'vacancyRate': self.vacancyRate,
            'avgTenantStay': self.avgTenantStay,
            'otherMonthlyIncome': self.otherMonthlyIncome,
            'vacancyLoss': self.vacancyLoss,
            'managementFees': self.managementFees,
            'maintenanceCosts': self.maintenanceCosts,
            'totalEquity': self.totalEquity
        }

    def __str__(self):
        return str(self.id)

@event.listens_for(Property, 'before_insert')
@event.listens_for(Property, 'before_update')
def validate_property(mapper, connection, target):
    """Validate property before saving"""
    target.validate_state()
    target.validate_zip_code()
    target.validate_costs()

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