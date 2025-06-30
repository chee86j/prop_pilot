import logger from "./logger.js";

export const convertToFloat = (value, defaultValue = 0.0) => {
  try {
    return value ? parseFloat(value) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

export const serializeProperty = (property) => {
  const serialized = {
    id: property.id,
    detail_link: property.detail_link,
    property_id: property.property_id,
    sheriff_number: property.sheriff_number,
    status_date: property.status_date
      ? property.status_date.toISOString()
      : null,
    plaintiff: property.plaintiff,
    defendant: property.defendant,
    zillow_url: property.zillow_url,
    propertyName: property.propertyName,
    address: property.address,
    city: property.city,
    state: property.state,
    zipCode: property.zipCode,
    county: property.county,
    bedroomsDescription: property.bedroomsDescription,
    bathroomsDescription: property.bathroomsDescription,
    kitchenDescription: property.kitchenDescription,
    amenitiesDescription: property.amenitiesDescription,

    // Financial fields
    purchaseCost: property.purchaseCost,
    refinanceCosts: property.refinanceCosts,
    totalRehabCost: property.totalRehabCost,
    equipmentCost: property.equipmentCost,
    constructionCost: property.constructionCost,
    largeRepairsCost: property.largeRepairsCost,
    renovationCost: property.renovationCost,
    kickStartFunds: property.kickStartFunds,
    lenderConstructionDrawsReceived: property.lenderConstructionDrawsReceived,
    utilitiesCost: property.utilitiesCost,
    sewer: property.sewer,
    water: property.water,
    lawn: property.lawn,
    garbage: property.garbage,
    yearlyPropertyTaxes: property.yearlyPropertyTaxes,
    mortgagePaid: property.mortgagePaid,
    homeownersInsurance: property.homeownersInsurance,
    expectedYearlyRent: property.expectedYearlyRent,
    rentalIncomeReceived: property.rentalIncomeReceived,
    numUnits: property.numUnits,
    vacancyRate: property.vacancyRate,
    avgTenantStay: property.avgTenantStay,
    otherMonthlyIncome: property.otherMonthlyIncome,
    vacancyLoss: property.vacancyLoss,
    managementFees: property.managementFees,
    maintenanceCosts: property.maintenanceCosts,
    totalEquity: property.totalEquity,

    // Sale projection
    arvSalePrice: property.arvSalePrice,
    realtorFees: property.realtorFees,
    propTaxtillEndOfYear: property.propTaxtillEndOfYear,
    lenderLoanBalance: property.lenderLoanBalance,
    payOffStatement: property.payOffStatement,
    attorneyFees: property.attorneyFees,
    miscFees: property.miscFees,
    utilities: property.utilities,
    cash2closeFromPurchase: property.cash2closeFromPurchase,
    cash2closeFromRefinance: property.cash2closeFromRefinance,
    totalRehabCosts: property.totalRehabCosts,
    expectedRemainingRentEndToYear: property.expectedRemainingRentEndToYear,
    totalExpenses: property.totalExpenses,
    totalConstructionDrawsReceived: property.totalConstructionDrawsReceived,
    projectNetProfitIfSold: property.projectNetProfitIfSold,
    cashFlow: property.cashFlow,
    cashRoi: property.cashRoi,
    rule2Percent: property.rule2Percent,
    rule50Percent: property.rule50Percent,
    financeAmount: property.financeAmount,
    purchaseCapRate: property.purchaseCapRate,

    // Contact information
    municipalBuildingAddress: property.municipalBuildingAddress,
    buildingDepartmentContact: property.buildingDepartmentContact,
    electricDepartmentContact: property.electricDepartmentContact,
    plumbingDepartmentContact: property.plumbingDepartmentContact,
    fireDepartmentContact: property.fireDepartmentContact,
    homeownersAssociationContact: property.homeownersAssociationContact,
    environmentalDepartmentContact: property.environmentalDepartmentContact,

    // Utility information
    typeOfHeatingAndCooling: property.typeOfHeatingAndCooling,
    waterCompany: property.waterCompany,
    waterAccountNumber: property.waterAccountNumber,
    electricCompany: property.electricCompany,
    electricAccountNumber: property.electricAccountNumber,
    gasOrOilCompany: property.gasOrOilCompany,
    gasOrOilAccountNumber: property.gasOrOilAccountNumber,
    sewerCompany: property.sewerCompany,
    sewerAccountNumber: property.sewerAccountNumber,

    // Key players
    sellersAgent: property.sellersAgent,
    sellersBroker: property.sellersBroker,
    sellersAgentPhone: property.sellersAgentPhone,
    sellersAttorney: property.sellersAttorney,
    sellersAttorneyPhone: property.sellersAttorneyPhone,
    escrowCompany: property.escrowCompany,
    escrowAgent: property.escrowAgent,
    escrowAgentPhone: property.escrowAgentPhone,
    buyersAgent: property.buyersAgent,
    buyersBroker: property.buyersBroker,
    buyersAgentPhone: property.buyersAgentPhone,
    buyersAttorney: property.buyersAttorney,
    buyersAttorneyPhone: property.buyersAttorneyPhone,
    titleInsuranceCompany: property.titleInsuranceCompany,
    titleAgent: property.titleAgent,
    titleAgentPhone: property.titleAgentPhone,
    titlePhone: property.titlePhone,

    // Lender information
    lender: property.lender,
    lenderPhone: property.lenderPhone,
    refinanceLender: property.refinanceLender,
    refinanceLenderPhone: property.refinanceLenderPhone,
    loanOfficer: property.loanOfficer,
    loanOfficerPhone: property.loanOfficerPhone,
    loanNumber: property.loanNumber,
    downPaymentPercentage: property.downPaymentPercentage,
    loanInterestRate: property.loanInterestRate,
    pmiPercentage: property.pmiPercentage,
    mortgageYears: property.mortgageYears,
    lenderPointsAmount: property.lenderPointsAmount,
    otherFees: property.otherFees,

    // Property management
    propertyManager: property.propertyManager,
    propertyManagerPhone: property.propertyManagerPhone,
    propertyManagementCompany: property.propertyManagementCompany,
    propertyManagementPhone: property.propertyManagementPhone,
    photographer: property.photographer,
    photographerPhone: property.photographerPhone,
    videographer: property.videographer,
    videographerPhone: property.videographerPhone,
    appraisalCompany: property.appraisalCompany,
    appraiser: property.appraiser,
    appraiserPhone: property.appraiserPhone,
    surveyor: property.surveyor,
    surveyorPhone: property.surveyorPhone,
    homeInspector: property.homeInspector,
    homeInspectorPhone: property.homeInspectorPhone,
    architect: property.architect,
    architectPhone: property.architectPhone,
  };

  return serialized;
};

export const serializePropertySummary = (property) => {
  return {
    id: property.id,
    propertyName: property.propertyName,
    address: property.address,
    city: property.city,
    state: property.state,
    zipCode: property.zipCode,
    county: property.county,
    purchaseCost: property.purchaseCost,
    totalRehabCost: property.totalRehabCost,
    arvSalePrice: property.arvSalePrice,
  };
};
