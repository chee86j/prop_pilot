# Data model reference

This inventory describes the model classes imported by `backend/models/__init__.py`. Types and options below are transcribed from SQLAlchemy declarations; database migrations and route validation can impose additional behavior. See the feature guides for workflows and validation.

## User

Source: `backend\models\user.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `first_name` | `db.String(512), nullable=False` |
| `last_name` | `db.String(512), nullable=False` |
| `email` | `db.String(512), unique=True, nullable=False` |
| `password_hash` | `db.String(512)` |
| `avatar` | `db.Text, nullable=True` |

## Property

Source: `backend\models\property.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `address` | `db.String(255), nullable=False` |
| `owner_id` | `db.Integer, db.ForeignKey('user.id'), nullable=False` |
| `purchase_price` | `db.Float, nullable=False` |
| `current_phase` | `db.String(50), nullable=False, default='ACQUISITION'` |
| `created_at` | `db.DateTime, default=datetime.utcnow` |
| `updated_at` | `db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow` |
| `detail_link` | `db.String(1024)` |
| `property_id` | `db.String(256)` |
| `sheriff_number` | `db.String(256)` |
| `status_date` | `db.Date` |
| `plaintiff` | `db.Text` |
| `defendant` | `db.Text` |
| `zillow_url` | `db.String(1024)` |
| `propertyName` | `db.String(512)` |
| `city` | `db.String(512)` |
| `state` | `db.String(512)` |
| `zipCode` | `db.String(128)` |
| `county` | `db.String(512)` |
| `bedroomsDescription` | `db.String(512)` |
| `bathroomsDescription` | `db.String(512)` |
| `kitchenDescription` | `db.String(512)` |
| `amenitiesDescription` | `db.String(512)` |
| `municipalBuildingAddress` | `db.String(1024)` |
| `buildingDepartmentContact` | `db.String(512)` |
| `electricDepartmentContact` | `db.String(512)` |
| `plumbingDepartmentContact` | `db.String(512)` |
| `fireDepartmentContact` | `db.String(512)` |
| `homeownersAssociationContact` | `db.String(512)` |
| `environmentalDepartmentContact` | `db.String(512)` |
| `purchaseCost` | `db.Float` |
| `refinanceCosts` | `db.Float` |
| `totalRehabCost` | `db.Float` |
| `equipmentCost` | `db.Float` |
| `constructionCost` | `db.Float` |
| `largeRepairsCost` | `db.Float` |
| `renovationCost` | `db.Float` |
| `kickStartFunds` | `db.Float` |
| `lenderConstructionDrawsReceived` | `db.Float` |
| `utilitiesCost` | `db.Float` |
| `sewer` | `db.Float` |
| `water` | `db.Float` |
| `lawn` | `db.Float` |
| `garbage` | `db.Float` |
| `yearlyPropertyTaxes` | `db.Float` |
| `mortgagePaid` | `db.Float` |
| `homeownersInsurance` | `db.Float` |
| `expectedYearlyRent` | `db.Float` |
| `rentalIncomeReceived` | `db.Float` |
| `numUnits` | `db.Integer` |
| `vacancyRate` | `db.Float` |
| `avgTenantStay` | `db.Float` |
| `otherMonthlyIncome` | `db.Float` |
| `vacancyLoss` | `db.Float` |
| `managementFees` | `db.Float` |
| `maintenanceCosts` | `db.Float` |
| `totalEquity` | `db.Float` |
| `arvSalePrice` | `db.Float` |
| `realtorFees` | `db.Float` |
| `propTaxtillEndOfYear` | `db.Float` |
| `lenderLoanBalance` | `db.Float` |
| `payOffStatement` | `db.Float` |
| `attorneyFees` | `db.Float` |
| `miscFees` | `db.Float` |
| `utilities` | `db.Float` |
| `cash2closeFromPurchase` | `db.Float` |
| `cash2closeFromRefinance` | `db.Float` |
| `totalRehabCosts` | `db.Float` |
| `expectedRemainingRentEndToYear` | `db.Float` |
| `totalExpenses` | `db.Float` |
| `totalConstructionDrawsReceived` | `db.Float` |
| `projectNetProfitIfSold` | `db.Float` |
| `cashFlow` | `db.Float` |
| `cashRoi` | `db.Float` |
| `rule2Percent` | `db.Float` |
| `rule50Percent` | `db.Float` |
| `financeAmount` | `db.Float` |
| `purchaseCapRate` | `db.Float` |
| `typeOfHeatingAndCooling` | `db.String(512)` |
| `waterCompany` | `db.String(512)` |
| `waterAccountNumber` | `db.String(32)` |
| `electricCompany` | `db.String(512)` |
| `electricAccountNumber` | `db.String(32)` |
| `gasOrOilCompany` | `db.String(512)` |
| `gasOrOilAccountNumber` | `db.String(32)` |
| `sewerCompany` | `db.String(512)` |
| `sewerAccountNumber` | `db.String(32)` |
| `sellersAgent` | `db.String(64)` |
| `sellersBroker` | `db.String(64)` |
| `sellersAgentPhone` | `db.String(64)` |
| `sellersAttorney` | `db.String(64)` |
| `sellersAttorneyPhone` | `db.String(64)` |
| `escrowCompany` | `db.String(128)` |
| `escrowAgent` | `db.String(64)` |
| `escrowAgentPhone` | `db.String(64)` |
| `buyersAgent` | `db.String(64)` |
| `buyersBroker` | `db.String(64)` |
| `buyersAgentPhone` | `db.String(64)` |
| `buyersAttorney` | `db.String(64)` |
| `buyersAttorneyPhone` | `db.String(64)` |
| `titleInsuranceCompany` | `db.String(128)` |
| `titleAgent` | `db.String(64)` |
| `titleAgentPhone` | `db.String(64)` |
| `titlePhone` | `db.String(64)` |
| `lender` | `db.String(128)` |
| `lenderPhone` | `db.String(64)` |
| `refinanceLender` | `db.String(128)` |
| `refinanceLenderPhone` | `db.String(64)` |
| `loanOfficer` | `db.String(128)` |
| `loanOfficerPhone` | `db.String(64)` |
| `loanNumber` | `db.String(64)` |
| `downPaymentPercentage` | `db.Float` |
| `loanInterestRate` | `db.Float` |
| `pmiPercentage` | `db.Float` |
| `mortgageYears` | `db.Integer` |
| `lenderPointsAmount` | `db.Float` |
| `otherFees` | `db.Float` |
| `propertyManager` | `db.String(128)` |
| `propertyManagerPhone` | `db.String(64)` |
| `propertyManagementCompany` | `db.String(128)` |
| `propertyManagementPhone` | `db.String(64)` |
| `photographer` | `db.String(128)` |
| `photographerPhone` | `db.String(64)` |
| `videographer` | `db.String(128)` |
| `videographerPhone` | `db.String(64)` |
| `appraisalCompany` | `db.String(128)` |
| `appraiser` | `db.String(128)` |
| `appraiserPhone` | `db.String(64)` |
| `surveyor` | `db.String(128)` |
| `surveyorPhone` | `db.String(64)` |
| `homeInspector` | `db.String(128)` |
| `homeInspectorPhone` | `db.String(64)` |
| `architect` | `db.String(128)` |
| `architectPhone` | `db.String(64)` |

## Phase

Source: `backend\models\property.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `property_id` | `db.Integer, db.ForeignKey('property.id')` |
| `name` | `db.String(512), nullable=False` |
| `startDate` | `db.Date, nullable=True` |
| `expectedStartDate` | `db.Date, nullable=True` |
| `endDate` | `db.Date, nullable=True` |
| `expectedEndDate` | `db.Date, nullable=True` |

## ConstructionDraw

Source: `backend\models\financial.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `property_id` | `db.Integer, db.ForeignKey('property.id')` |
| `release_date` | `db.Date, nullable=False` |
| `amount` | `db.Float, nullable=False` |
| `bank_account_number` | `db.String(256), nullable=False` |
| `is_approved` | `db.Boolean, default=False, nullable=False` |

## Receipt

Source: `backend\models\financial.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `construction_draw_id` | `db.Integer, db.ForeignKey('construction_draw.id')` |
| `date` | `db.Date, nullable=False` |
| `vendor` | `db.String(512), nullable=False` |
| `amount` | `db.Float, nullable=False` |
| `description` | `db.Text, nullable=True` |
| `pointofcontact` | `db.String(512), nullable=True` |
| `ccnumber` | `db.String(4), nullable=True` |

## Tenant

Source: `backend\models\tenant.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `firstName` | `db.String(255), nullable=False` |
| `lastName` | `db.String(255), nullable=False` |
| `phoneNumber` | `db.String(255), nullable=True` |
| `email` | `db.String(255), unique=True, nullable=False` |
| `dateOfBirth` | `db.Date, nullable=False` |
| `occupation` | `db.String(255), nullable=True` |
| `employerName` | `db.String(255), nullable=True` |
| `professionalTitle` | `db.String(255), nullable=True` |
| `creditScoreAtInitialApplication` | `db.Integer` |
| `creditCheck1Complete` | `db.Boolean` |
| `creditScoreAtLeaseRenewal` | `db.Integer` |
| `creditCheck2Complete` | `db.Boolean` |
| `guarantor` | `db.String(255), nullable=True` |
| `petsAllowed` | `db.Boolean, default=False` |
| `manager_id` | `db.Integer, db.ForeignKey('user.id', ondelete='SET NULL')` |

## Lease

Source: `backend\models\tenant.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `tenantId` | `db.Integer, db.ForeignKey('tenant.id', ondelete='CASCADE'), nullable=False` |
| `propertyId` | `db.Integer, db.ForeignKey('property.id', ondelete='CASCADE'), nullable=False` |
| `startDate` | `db.Date, nullable=False` |
| `endDate` | `db.Date, nullable=False` |
| `rentAmount` | `db.Float, nullable=False` |
| `renewalCondition` | `db.String(255), nullable=True` |
| `typeOfLease` | `db.String(100), nullable=False` |

## PropertyMaintenanceRequest

Source: `backend\models\maintenance.py`.

| Field | SQLAlchemy column declaration |
| --- | --- |
| `id` | `db.Integer, primary_key=True` |
| `propertyId` | `db.Integer, db.ForeignKey('property.id'), nullable=False` |
| `tenantId` | `db.Integer, db.ForeignKey('tenant.id'), nullable=False` |
| `description` | `db.Text, nullable=False` |
| `status` | `db.String(100), default='pending'` |
| `timeToCompletion` | `db.Integer` |
| `createdAt` | `db.DateTime, default=db.func.current_timestamp()` |
| `updatedAt` | `db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp()` |
