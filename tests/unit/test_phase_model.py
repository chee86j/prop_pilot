import pytest
from models import Phase, Property
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)

# Test data for parametrized tests
PHASE_TEST_DATA = [
    {
        'name': 'Foundation Phase',
        'days_duration': 30,
        'description': 'Basic foundation work'
    },
    {
        'name': 'Framing Phase',
        'days_duration': 45,
        'description': 'Structural framing work'
    },
    {
        'name': 'Finishing Phase',
        'days_duration': 60,
        'description': 'Interior and exterior finishing'
    }
]

@pytest.fixture(autouse=True)
def cleanup_phases(db_session):
    """Clean up phases before each test"""
    logger.info('Cleaning up phases')
    db_session.query(Phase).delete()
    db_session.commit()
    logger.info('Phases cleaned up')
    yield
    # Cleanup after test
    db_session.query(Phase).delete()
    db_session.commit()

@pytest.fixture
def sample_property(db_session):
    """Fixture for creating a test property"""
    property = Property(
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    db_session.add(property)
    db_session.commit()
    return property

@pytest.mark.model
@pytest.mark.unit
def test_new_phase(db_session, logger):
    """Test creating a new phase"""
    logger.info("🏗️ Starting new phase creation test...")
    
    phase = Phase(
        property_id=1,
        name="Test Phase",
        startDate=date.today(),
        expectedStartDate=date.today() - timedelta(days=1),
        endDate=date.today() + timedelta(days=30),
        expectedEndDate=date.today() + timedelta(days=28)
    )
    
    logger.debug(f"📝 {phase.name = }")
    logger.debug(f"📅 {phase.startDate = }")
    
    db_session.add(phase)
    db_session.commit()

    # Query for the specific phase we just created
    retrieved_phase = Phase.query.filter_by(name="Test Phase").first()
    assert retrieved_phase is not None
    assert retrieved_phase.name == "Test Phase"
    assert retrieved_phase.property_id == 1
    assert retrieved_phase.startDate == date.today()
    assert retrieved_phase.expectedEndDate == date.today() + timedelta(days=28)
    
    logger.info("✅ Phase creation test completed successfully")

@pytest.mark.model
@pytest.mark.unit
def test_phase_property_relationship(db_session, sample_property, logger):
    """Test phase-property relationship"""
    logger.info("🔗 Starting phase-property relationship test...")

    # Create a phase associated with the property
    phase = Phase(
        property_id=sample_property.id,
        name="Test Phase",
        startDate=date.today(),
        expectedEndDate=date.today() + timedelta(days=30)
    )
    db_session.add(phase)
    db_session.commit()

    logger.debug(f"🏠 {sample_property.propertyName = }")
    logger.debug(f"📑 {phase.name = }")

    # Test the relationship from both directions
    assert sample_property.phases.first() == phase
    assert phase.property == sample_property
    
    logger.info("✅ Phase-property relationship test completed successfully")

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("phase_data", PHASE_TEST_DATA)
def test_phase_creation_parametrized(db_session, sample_property, phase_data, logger):
    """Test phase creation with different data sets"""
    logger.info(f"🏗️ Starting parametrized phase creation test for {phase_data['name']}...")
    
    phase = Phase(
        property_id=sample_property.id,
        name=phase_data['name'],
        startDate=date.today(),
        expectedEndDate=date.today() + timedelta(days=phase_data['days_duration'])
    )
    
    db_session.add(phase)
    db_session.commit()

    retrieved_phase = Phase.query.filter_by(name=phase_data['name']).first()
    assert retrieved_phase is not None
    assert retrieved_phase.name == phase_data['name']
    assert retrieved_phase.expectedEndDate == date.today() + timedelta(days=phase_data['days_duration'])
    
    logger.info(f"✅ Parametrized phase creation test completed for {phase_data['name']}")

@pytest.mark.model
@pytest.mark.unit
def test_phase_serialization(db_session, logger):
    """Test phase serialization method"""
    logger.info("📦 Starting phase serialization test...")
    
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
    logger.debug(f"🔄 {serialized = }")
    
    assert serialized["name"] == "Test Phase"
    assert serialized["property_id"] == 1
    assert serialized["startDate"] == test_date.isoformat()
    assert serialized["expectedEndDate"] == (test_date + timedelta(days=28)).isoformat()
    
    logger.info("✅ Phase serialization test completed successfully")

@pytest.mark.model
@pytest.mark.unit
def test_phase_nullable_dates(db_session, logger):
    """Test that dates can be null"""
    logger.info("📅 Starting nullable dates test...")
    
    phase = Phase(
        property_id=1,
        name="Test Phase"
    )
    db_session.add(phase)
    db_session.commit()

    retrieved_phase = Phase.query.first()
    logger.debug(f"📝 {retrieved_phase.name = }")
    logger.debug(f"📅 {retrieved_phase.startDate = }")
    
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
    
    logger.info("✅ Nullable dates test completed successfully") 