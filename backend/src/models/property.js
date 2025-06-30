import { DataTypes } from "sequelize";
import BaseModel from "./base.js";
import sequelize from "../config/database.js";
import { ValidationError } from "./base.js";
import logger from "../utils/logger.js";

class Property extends BaseModel {
  validate() {
    if (
      this.state &&
      (this.state.length !== 2 || !/^[A-Za-z]+$/.test(this.state))
    ) {
      throw new ValidationError("State must be a 2-letter code");
    }
    if (this.zipCode && this.zipCode.length !== 5) {
      throw new ValidationError("Zip code must be 5 digits");
    }
  }

  toJSON() {
    const values = super.toJSON();
    // Add any custom serialization logic here
    return values;
  }
}

Property.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    current_phase: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "ACQUISITION",
    },
    // Foreclosure Fields
    detail_link: DataTypes.STRING(1024),
    property_id: DataTypes.STRING(256),
    sheriff_number: DataTypes.STRING(256),
    status_date: DataTypes.DATE,
    plaintiff: DataTypes.TEXT,
    defendant: DataTypes.TEXT,
    zillow_url: DataTypes.STRING(1024),

    // Location Section
    propertyName: DataTypes.STRING(512),
    city: DataTypes.STRING(512),
    state: {
      type: DataTypes.STRING(512),
      validate: {
        len: [2, 2],
        isAlpha: true,
      },
    },
    zipCode: {
      type: DataTypes.STRING(128),
      validate: {
        len: [5, 5],
        isNumeric: true,
      },
    },
    county: DataTypes.STRING(512),
    bedroomsDescription: DataTypes.STRING(512),
    bathroomsDescription: DataTypes.STRING(512),
    kitchenDescription: DataTypes.STRING(512),
    amenitiesDescription: DataTypes.STRING(512),

    // Departments
    municipalBuildingAddress: DataTypes.STRING(1024),
    buildingDepartmentContact: DataTypes.STRING(512),
    electricDepartmentContact: DataTypes.STRING(512),
    plumbingDepartmentContact: DataTypes.STRING(512),
    fireDepartmentContact: DataTypes.STRING(512),
    homeownersAssociationContact: DataTypes.STRING(512),
    environmentalDepartmentContact: DataTypes.STRING(512),

    // Financial Fields
    purchaseCost: DataTypes.FLOAT,
    refinanceCosts: DataTypes.FLOAT,
    totalRehabCost: DataTypes.FLOAT,
    equipmentCost: DataTypes.FLOAT,
    constructionCost: DataTypes.FLOAT,
    largeRepairsCost: DataTypes.FLOAT,
    renovationCost: DataTypes.FLOAT,
    kickStartFunds: DataTypes.FLOAT,
    lenderConstructionDrawsReceived: DataTypes.FLOAT,
    utilitiesCost: DataTypes.FLOAT,
    sewer: DataTypes.FLOAT,
    water: DataTypes.FLOAT,
    lawn: DataTypes.FLOAT,
    garbage: DataTypes.FLOAT,
    yearlyPropertyTaxes: DataTypes.FLOAT,
    mortgagePaid: DataTypes.FLOAT,
    homeownersInsurance: DataTypes.FLOAT,
    expectedYearlyRent: DataTypes.FLOAT,
    rentalIncomeReceived: DataTypes.FLOAT,
    numUnits: DataTypes.INTEGER,
    vacancyRate: DataTypes.FLOAT,
    avgTenantStay: DataTypes.FLOAT,
    otherMonthlyIncome: DataTypes.FLOAT,
    vacancyLoss: DataTypes.FLOAT,
    managementFees: DataTypes.FLOAT,
    maintenanceCosts: DataTypes.FLOAT,
    totalEquity: DataTypes.FLOAT,

    // Sale Projection
    arvSalePrice: DataTypes.FLOAT,
    realtorFees: DataTypes.FLOAT,
    propTaxtillEndOfYear: DataTypes.FLOAT,
    lenderLoanBalance: DataTypes.FLOAT,
    payOffStatement: DataTypes.FLOAT,
    attorneyFees: DataTypes.FLOAT,
    miscFees: DataTypes.FLOAT,
    utilities: DataTypes.FLOAT,
    cash2closeFromPurchase: DataTypes.FLOAT,
    cash2closeFromRefinance: DataTypes.FLOAT,
    totalRehabCosts: DataTypes.FLOAT,
    expectedRemainingRentEndToYear: DataTypes.FLOAT,
    totalExpenses: DataTypes.FLOAT,
    totalConstructionDrawsReceived: DataTypes.FLOAT,
    projectNetProfitIfSold: DataTypes.FLOAT,
    cashFlow: DataTypes.FLOAT,
    cashRoi: DataTypes.FLOAT,
    rule2Percent: DataTypes.FLOAT,
    rule50Percent: DataTypes.FLOAT,
    financeAmount: DataTypes.FLOAT,
    purchaseCapRate: DataTypes.FLOAT,

    // Utility Information
    typeOfHeatingAndCooling: DataTypes.STRING(512),
    waterCompany: DataTypes.STRING(512),
    waterAccountNumber: DataTypes.STRING(32),
    electricCompany: DataTypes.STRING(512),
    electricAccountNumber: DataTypes.STRING(32),
    gasOrOilCompany: DataTypes.STRING(512),
    gasOrOilAccountNumber: DataTypes.STRING(32),
    sewerCompany: DataTypes.STRING(512),
    sewerAccountNumber: DataTypes.STRING(32),

    // Key Players Information
    sellersAgent: DataTypes.STRING(64),
    sellersBroker: DataTypes.STRING(64),
    sellersAgentPhone: DataTypes.STRING(64),
    sellersAttorney: DataTypes.STRING(64),
    sellersAttorneyPhone: DataTypes.STRING(64),
    escrowCompany: DataTypes.STRING(128),
    escrowAgent: DataTypes.STRING(64),
    escrowAgentPhone: DataTypes.STRING(64),
    buyersAgent: DataTypes.STRING(64),
    buyersBroker: DataTypes.STRING(64),
    buyersAgentPhone: DataTypes.STRING(64),
    buyersAttorney: DataTypes.STRING(64),
    buyersAttorneyPhone: DataTypes.STRING(64),
    titleInsuranceCompany: DataTypes.STRING(128),
    titleAgent: DataTypes.STRING(64),
    titleAgentPhone: DataTypes.STRING(64),
    titlePhone: DataTypes.STRING(64),

    // Lender Information
    lender: DataTypes.STRING(128),
    lenderPhone: DataTypes.STRING(64),
    refinanceLender: DataTypes.STRING(128),
    refinanceLenderPhone: DataTypes.STRING(64),
    loanOfficer: DataTypes.STRING(128),
    loanOfficerPhone: DataTypes.STRING(64),
    loanNumber: DataTypes.STRING(64),
    downPaymentPercentage: DataTypes.FLOAT,
    loanInterestRate: DataTypes.FLOAT,
    pmiPercentage: DataTypes.FLOAT,
    mortgageYears: DataTypes.INTEGER,
    lenderPointsAmount: DataTypes.FLOAT,
    otherFees: DataTypes.FLOAT,

    // Sales & Marketing
    propertyManager: DataTypes.STRING(128),
    propertyManagerPhone: DataTypes.STRING(64),
    propertyManagementCompany: DataTypes.STRING(128),
    propertyManagementPhone: DataTypes.STRING(64),
    photographer: DataTypes.STRING(128),
    photographerPhone: DataTypes.STRING(64),
    videographer: DataTypes.STRING(128),
    videographerPhone: DataTypes.STRING(64),
    appraisalCompany: DataTypes.STRING(128),
    appraiser: DataTypes.STRING(128),
    appraiserPhone: DataTypes.STRING(64),
    surveyor: DataTypes.STRING(128),
    surveyorPhone: DataTypes.STRING(64),
    homeInspector: DataTypes.STRING(128),
    homeInspectorPhone: DataTypes.STRING(64),
    architect: DataTypes.STRING(128),
    architectPhone: DataTypes.STRING(64),
  },
  {
    sequelize,
    modelName: "Property",
    tableName: "properties",
    indexes: [
      {
        fields: ["owner_id"],
      },
    ],
    hooks: {
      beforeValidate: async (property) => {
        property.validate();
      },
      beforeSave: async (property) => {
        logger.info("Saving property", {
          id: property.id,
          address: property.address,
        });
      },
    },
  }
);

export default Property;
