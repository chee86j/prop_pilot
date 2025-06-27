import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../index";
import { ValidationError } from "../../utils/errors";

interface PropertyAttributes {
  id: number;
  address: string;
  owner_id: number;
  purchase_price: number;
  current_phase: string;
  created_at: Date;
  updated_at: Date;

  // Foreclosure Fields
  detail_link?: string;
  property_id?: string;
  sheriff_number?: string;
  status_date?: Date;
  plaintiff?: string;
  defendant?: string;
  zillow_url?: string;

  // Location Section
  propertyName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  bedroomsDescription?: string;
  bathroomsDescription?: string;
  kitchenDescription?: string;
  amenitiesDescription?: string;

  // Financial Fields
  purchaseCost?: number;
  refinanceCosts?: number;
  totalRehabCost?: number;
  equipmentCost?: number;
  constructionCost?: number;
  largeRepairsCost?: number;
  renovationCost?: number;

  // Additional Financial Fields
  kickStartFunds?: number;
  lenderConstructionDrawsReceived?: number;
  utilitiesCost?: number;
  yearlyPropertyTaxes?: number;
  mortgagePaid?: number;
  homeownersInsurance?: number;
  expectedYearlyRent?: number;
  rentalIncomeReceived?: number;
  numUnits?: number;
  vacancyRate?: number;
  avgTenantStay?: number;
  otherMonthlyIncome?: number;
  vacancyLoss?: number;
  managementFees?: number;
  maintenanceCosts?: number;
  totalEquity?: number;
}

interface PropertyCreationAttributes
  extends Optional<PropertyAttributes, "id" | "created_at" | "updated_at"> {}

class Property
  extends Model<PropertyAttributes, PropertyCreationAttributes>
  implements PropertyAttributes
{
  public id!: number;
  public address!: string;
  public owner_id!: number;
  public purchase_price!: number;
  public current_phase!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Implementing all optional fields
  public detail_link?: string;
  public property_id?: string;
  public sheriff_number?: string;
  public status_date?: Date;
  public plaintiff?: string;
  public defendant?: string;
  public zillow_url?: string;

  // Location fields
  public propertyName?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public county?: string;
  public bedroomsDescription?: string;
  public bathroomsDescription?: string;
  public kitchenDescription?: string;
  public amenitiesDescription?: string;

  // Financial fields
  public purchaseCost?: number;
  public refinanceCosts?: number;
  public totalRehabCost?: number;
  public equipmentCost?: number;
  public constructionCost?: number;
  public largeRepairsCost?: number;
  public renovationCost?: number;

  // Validation methods
  public validateState(): void {
    if (
      this.state &&
      (this.state.length !== 2 || !/^[A-Za-z]+$/.test(this.state))
    ) {
      throw new ValidationError("State must be a 2-letter code");
    }
  }

  public validateZipCode(): void {
    if (this.zipCode && this.zipCode.length !== 5) {
      throw new ValidationError("Zip code must be 5 digits");
    }
  }

  // Hooks will be defined after model initialization
}

Property.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Foreclosure Fields
    detail_link: DataTypes.STRING(1024),
    property_id: DataTypes.STRING(256),
    sheriff_number: DataTypes.STRING(256),
    status_date: DataTypes.DATE,
    plaintiff: DataTypes.TEXT,
    defendant: DataTypes.TEXT,
    zillow_url: DataTypes.STRING(1024),

    // Location Fields
    propertyName: DataTypes.STRING(512),
    city: DataTypes.STRING(512),
    state: DataTypes.STRING(512),
    zipCode: DataTypes.STRING(128),
    county: DataTypes.STRING(512),
    bedroomsDescription: DataTypes.STRING(512),
    bathroomsDescription: DataTypes.STRING(512),
    kitchenDescription: DataTypes.STRING(512),
    amenitiesDescription: DataTypes.STRING(512),

    // Financial Fields
    purchaseCost: DataTypes.FLOAT,
    refinanceCosts: DataTypes.FLOAT,
    totalRehabCost: DataTypes.FLOAT,
    equipmentCost: DataTypes.FLOAT,
    constructionCost: DataTypes.FLOAT,
    largeRepairsCost: DataTypes.FLOAT,
    renovationCost: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "Property",
    tableName: "properties",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: (instance: Property) => {
        instance.validateState();
        instance.validateZipCode();
      },
    },
    indexes: [
      {
        fields: ["owner_id"],
        name: "idx_user_property",
      },
    ],
  }
);

export default Property;
