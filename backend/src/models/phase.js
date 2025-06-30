import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Phase extends Model {}

Phase.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    propertyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'properties',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'delayed', 'cancelled'),
        defaultValue: 'not_started'
    },
    budget: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    actualCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    completionPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    attachments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    dependencies: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: []
    }
}, {
    sequelize,
    modelName: 'Phase',
    tableName: 'phases',
    timestamps: true,
    indexes: [
        {
            fields: ['propertyId']
        },
        {
            fields: ['status']
        },
        {
            fields: ['order']
        }
    ]
});

export default Phase;
