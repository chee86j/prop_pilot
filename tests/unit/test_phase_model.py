import pytest
from models import Phase, Property
from datetime import date, timedelta

def test_new_phase(db_session):
    """Test creating a new phase"""
    phase = Phase(
        property_id=1,
        name="Test Phase",
        startDate=date.today(),
        expectedStartDate=date.today() - timedelta(days=1),
        endDate=date.today() + timedelta(days=30),
        expectedEndDate=date.today() + timedelta(days=28)
    )
    db_session.add(phase)
    db_session.commit()

    retrieved_phase = Phase.query.first()
    assert retrieved_phase is not None
    assert retrieved_phase.name == "Test Phase"
    assert retrieved_phase.property_id == 1
    assert retrieved_phase.startDate == date.today()
    assert retrieved_phase.expectedEndDate == date.today() + timedelta(days=28)

def test_phase_property_relationship(db_session):
    """Test phase-property relationship"""
    # Create a property first
    property = Property(
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    db_session.add(property)
    db_session.commit()

    # Create a phase associated with the property
    phase = Phase(
        property_id=property.id,
        name="Test Phase",
        startDate=date.today(),
        expectedEndDate=date.today() + timedelta(days=30)
    )
    db_session.add(phase)
    db_session.commit()

    # Test the relationship from both directions
    assert property.phases.first() == phase
    assert phase.property == property

def test_phase_serialization(db_session):
    """Test phase serialization method"""
    test_date = date.today()
    phase = Phase(
        property_id=1,
        name="Test Phase",
        startDate=test_date,
        expectedStartDate=test_date,
        endDate=test_date + timedelta(days=30),
        expectedEndDate=test_date + timedelta(days=28)
    )
    db_session.add(phase)
    db_session.commit()

    serialized = phase.serialize()
    assert serialized["name"] == "Test Phase"
    assert serialized["property_id"] == 1
    assert serialized["startDate"] == test_date.isoformat()
    assert serialized["expectedEndDate"] == (test_date + timedelta(days=28)).isoformat()

def test_phase_nullable_dates(db_session):
    """Test that dates can be null"""
    phase = Phase(
        property_id=1,
        name="Test Phase"
    )
    db_session.add(phase)
    db_session.commit()

    retrieved_phase = Phase.query.first()
    assert retrieved_phase.startDate is None
    assert retrieved_phase.expectedStartDate is None
    assert retrieved_phase.endDate is None
    assert retrieved_phase.expectedEndDate is None

    # Test serialization with null dates
    serialized = retrieved_phase.serialize()
    assert serialized["startDate"] is None
    assert serialized["expectedStartDate"] is None
    assert serialized["endDate"] is None
    assert serialized["expectedEndDate"] is None 