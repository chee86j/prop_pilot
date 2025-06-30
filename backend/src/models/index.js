import User from './User.js';
import Property from './Property.js';
import Phase from './Phase.js';
import Tenant from './Tenant.js';
import Lease from './Lease.js';
import MaintenanceRequest from './MaintenanceRequest.js';
import ConstructionDraw from './ConstructionDraw.js';
import Receipt from './Receipt.js';

// User associations
User.hasMany(Property, { foreignKey: 'ownerId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Property associations
Property.hasMany(Phase, { foreignKey: 'propertyId', as: 'phases' });
Phase.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Property.hasMany(Tenant, { foreignKey: 'propertyId', as: 'tenants' });
Tenant.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Property.hasMany(Lease, { foreignKey: 'propertyId', as: 'leases' });
Lease.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Property.hasMany(MaintenanceRequest, { foreignKey: 'propertyId', as: 'maintenanceRequests' });
MaintenanceRequest.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Property.hasMany(ConstructionDraw, { foreignKey: 'propertyId', as: 'constructionDraws' });
ConstructionDraw.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Property.hasMany(Receipt, { foreignKey: 'propertyId', as: 'receipts' });
Receipt.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Tenant associations
Tenant.hasMany(Lease, { foreignKey: 'tenantId', as: 'leases' });
Lease.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

Tenant.hasMany(MaintenanceRequest, { foreignKey: 'tenantId', as: 'maintenanceRequests' });
MaintenanceRequest.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

Tenant.hasMany(Receipt, { foreignKey: 'tenantId', as: 'receipts' });
Receipt.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

export {
    User,
    Property,
    Phase,
    Tenant,
    Lease,
    MaintenanceRequest,
    ConstructionDraw,
    Receipt
};
