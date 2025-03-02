import pytest
from models import Property, Phase
from datetime import date

def test_new_property(db_session):
    """Test creating a new property"""
    property = Property(
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345",
        purchaseCost=100000,
        totalRehabCost=50000,
        arvSalePrice=200000
    )
    db_session.add(property)
    db_session.commit()

    retrieved_property = Property.query.first()
    assert retrieved_property is not None
    assert retrieved_property.propertyName == "Test Property"
    assert retrieved_property.purchaseCost == 100000

def test_property_phases_relationship(db_session):
    """Test property-phases relationship"""
    property = Property(
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345",
        purchaseCost=100000,
        totalRehabCost=50000,
        arvSalePrice=200000
    )
    db_session.add(property)
    db_session.commit()

    phase = Phase(
        property_id=property.id,
        name="Phase 1",
        startDate=date.today(),
        expectedEndDate=date.today()
    )
    db_session.add(phase)
    db_session.commit()

    assert len(property.phases) == 1
    assert property.phases[0].name == "Phase 1" 