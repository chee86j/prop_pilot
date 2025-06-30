import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Property extends Model {}

Property.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    propertyType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    purchaseCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    refinanceCosts: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    totalRehabCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    equipmentCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    constructionCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    largeRepairsCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    renovationCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    kickStartFunds: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    lenderConstructionDrawsReceived: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    utilitiesCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    yearlyPropertyTaxes: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    mortgagePaid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    homeownersInsurance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    expectedYearlyRent: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    rentalIncomeReceived: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    vacancyRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    managementFees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    maintenanceCosts: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    arvSalePrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    realtorFees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    lenderLoanBalance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    financeAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    purchaseCapRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    downPaymentPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 20
    },
    loanInterestRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    pmiPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'pending', 'sold', 'rented'),
        defaultValue: 'pending'
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Property',
    tableName: 'properties',
    timestamps: true,
    indexes: [
        {
            fields: ['ownerId']
        },
        {
            fields: ['status']
        }
    ]
});

export default Property;
