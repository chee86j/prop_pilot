from models import db, Property

# Function to calculate profit/loss of a property
def get_property_profit_loss(property_id):
    # Query property data while coalescing null values to 0
    property = db.session.query(
        Property.id,
        db.func.coalesce(db.func.sum(Property.expectedYearlyRent), 0).label('total_expected_rent'),
        db.func.coalesce(db.func.sum(Property.rentalIncomeReceived), 0).label('total_rent_received'),
        db.func.coalesce(db.func.sum(
            Property.purchaseCost + 
            Property.refinanceCosts + 
            Property.totalRehabCosts +
            Property.utilitiesCost + 
            Property.yearlyPropertyTaxes + 
            Property.mortgagePaid +
            Property.homeownersInsurance + 
            Property.managementFees + 
            Property.maintenanceCosts +
            Property.miscFees), 0).label('total_expenses')
    ).filter(Property.id == property_id).group_by(Property.id).first()

    if property:
        net_profit = property.total_rent_received - property.total_expenses
        return {
            'total_expected_rent': property.total_expected_rent,
            'total_rent_received': property.total_rent_received,
            'total_expenses': property.total_expenses,
            'net_profit': net_profit
        }
    else:
        # Return None or a specific error message if property does not exist
        return None
