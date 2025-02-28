from sqlalchemy import Index
from .base import db

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))  # Many to one relationship w/User
    
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
    construction_draws = db.relationship('ConstructionDraw', backref='property', lazy='dynamic')
    phases = db.relationship('Phase', backref='property', lazy='dynamic')
    leases = db.relationship('Lease', backref='property', lazy=True)
    maintenance_requests = db.relationship('PropertyMaintenanceRequest', backref='property', lazy=True)

    # Indexes
    __table_args__ = (Index('idx_user_property', 'user_id'),)


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