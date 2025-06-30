import User from "./user.js";
import Property from "./property.js";
import Phase from "./phase.js";

// Define associations
User.hasMany(Property, {
  foreignKey: "owner_id",
  as: "owned_properties",
});

Property.belongsTo(User, {
  foreignKey: "owner_id",
  as: "owner",
});

Property.hasMany(Phase, {
  foreignKey: "property_id",
  as: "phases",
});

Phase.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});

export { User, Property, Phase };
