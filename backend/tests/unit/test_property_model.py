import pytest
from models import Property, Phase, Lease, Tenant
from datetime import date, timedelta
from models.tenant import ValidationError

# Test data for parametrized tests
PROPERTY_TEST_DATA = [
    {
        'propertyName': 'Suburban House',
        'address': '123 Maple St',
        'city': 'Springfield',
        'state': 'IL',
        'zipCode': '62701',
        'purchaseCost': 180000,
        'totalRehabCost': 45000,
        'arvSalePrice': 280000,
        'description': 'single family home'
    },
    {
        'propertyName': 'Downtown Condo',
        'address': '456 Urban Ave',
        'city': 'Chicago',
        'state': 'IL',
        'zipCode': '60601',
        'purchaseCost': 250000,
        'totalRehabCost': 30000,
        'arvSalePrice': 350000,
        'description': 'luxury condo'
    },
    {
        'propertyName': 'Beach House',
        'address': '789 Ocean Dr',
        'city': 'Miami',
        'state': 'FL',
        'zipCode': '33139',
        'purchaseCost': 400000,
        'totalRehabCost': 100000,
        'arvSalePrice': 600000,
        'description': 'vacation property'
    }
]

PHASE_TEST_DATA = [
    {
        'name': 'Foundation',
        'startDate': date.today(),
        'expectedEndDate': date.today() + timedelta(days=30),
        'description': 'foundation work'
    },
    {
        'name': 'Framing',
        'startDate': date.today() + timedelta(days=31),
        'expectedEndDate': date.today() + timedelta(days=60),
        'description': 'structural framing'
    },
    {
        'name': 'Finishing',
        'startDate': date.today() + timedelta(days=61),
        'expectedEndDate': date.today() + timedelta(days=90),
        'description': 'interior finishing'
    }
]

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("property_data", PROPERTY_TEST_DATA)
def test_new_property(db_session, logger, property_data):
    """Test creating a new property"""
    logger.info(f"🏠 Starting new property test for {property_data['description']}...")
    
    property = Property(
        propertyName=property_data['propertyName'],
        address=property_data['address'],
        city=property_data['city'],
        state=property_data['state'],
        zipCode=property_data['zipCode'],
        purchaseCost=property_data['purchaseCost'],
        totalRehabCost=property_data['totalRehabCost'],
        arvSalePrice=property_data['arvSalePrice']
    )
    
    logger.debug(f"📍 {property.address = }")
    logger.debug(f"💰 {property.purchaseCost = }")
    logger.debug(f"💲 {property.arvSalePrice = }")
    
    db_session.add(property)
    db_session.commit()

    retrieved_property = Property.query.filter_by(address=property_data['address']).first()
    assert retrieved_property is not None
    assert retrieved_property.propertyName == property_data['propertyName']
    assert retrieved_property.purchaseCost == property_data['purchaseCost']
    assert retrieved_property.totalRehabCost == property_data['totalRehabCost']
    assert retrieved_property.arvSalePrice == property_data['arvSalePrice']
    
    logger.info(f"✅ New property test completed for {property_data['description']}")

@pytest.mark.model
@pytest.mark.unit
def test_property_phases_relationship(db_session, logger):
    """Test property-phases relationship"""
    logger.info("🔗 Starting property-phases relationship test...")
    
    # Create a property
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

    logger.debug(f"🏠 Created property with ID: {property.id}")

    # Add phases to property
    for phase_data in PHASE_TEST_DATA:
        phase = Phase(
            property_id=property.id,
            name=phase_data['name'],
            startDate=phase_data['startDate'],
            expectedEndDate=phase_data['expectedEndDate']
        )
        db_session.add(phase)
    db_session.commit()

    logger.debug(f"📋 Added {len(PHASE_TEST_DATA)} phases to property")

    # Test relationships
    property_phases = db_session.query(Phase).filter_by(property_id=property.id).all()
    assert len(property_phases) == len(PHASE_TEST_DATA)
    for i, phase in enumerate(property_phases):
        assert phase.name == PHASE_TEST_DATA[i]['name']
        assert phase.property == property
    
    logger.info("✅ Property-phases relationship test completed")

@pytest.mark.model
@pytest.mark.unit
def test_property_lease_relationship(db_session, logger):
    """Test property-lease relationship"""
    logger.info("🔗 Starting property-lease relationship test...")
    
    # Create property
    property = Property(
        propertyName="Rental Property",
        address="456 Rent St",
        city="Test City",
        state="TS",
        zipCode="12345",
        purchaseCost=150000,
        totalRehabCost=25000,
        arvSalePrice=250000
    )
    db_session.add(property)
    db_session.commit()

    logger.debug(f"🏠 Created property with ID: {property.id}")

    # Create tenant
    tenant = Tenant(
        firstName="John",
        lastName="Renter",
        email="john.renter@example.com",
        dateOfBirth=date(1990, 1, 1),
        phoneNumber="123-456-7890"
    )
    db_session.add(tenant)
    db_session.commit()

    logger.debug(f"👤 Created tenant with ID: {tenant.id}")

    # Create lease
    lease = Lease(
        tenantId=tenant.id,
        propertyId=property.id,
        startDate=date.today(),
        endDate=date.today() + timedelta(days=365),
        rentAmount=2000,
        typeOfLease='Fixed'
    )
    db_session.add(lease)
    db_session.commit()

    logger.debug(f"📄 Created lease with ID: {lease.id}")

    # Test relationships
    assert len(property.leases) == 1
    assert property.leases[0].rentAmount == 2000
    assert property.leases[0].tenant == tenant
    assert lease.property == property
    
    logger.info("✅ Property-lease relationship test completed")

@pytest.mark.model
@pytest.mark.unit
def test_property_validation(db_session, logger):
    """Test property data validation"""
    logger.info("✔️ Starting property validation test...")
    
    # Test invalid state code
    with pytest.raises(ValidationError, match='State must be a 2-letter code'):
        property = Property(
            propertyName="Test Property",
            address="123 Test St",
            city="Test City",
            state="Invalid",  # Should be 2 letters
            zipCode="12345",
            purchaseCost=100000
        )
        db_session.add(property)
        db_session.commit()
    
    logger.debug("❌ Invalid state code rejected")
    db_session.rollback()

    # Test invalid zip code
    with pytest.raises(ValidationError, match='Zip code must be 5 digits'):
        property = Property(
            propertyName="Test Property",
            address="123 Test St",
            city="Test City",
            state="TX",
            zipCode="1234",  # Too short
            purchaseCost=100000
        )
        db_session.add(property)
        db_session.commit()
    
    logger.debug("❌ Invalid zip code rejected")
    db_session.rollback()

    # Test negative costs
    with pytest.raises(ValidationError, match='purchaseCost cannot be negative'):
        property = Property(
            propertyName="Test Property",
            address="123 Test St",
            city="Test City",
            state="TX",
            zipCode="12345",
            purchaseCost=-100000  # Negative cost
        )
        db_session.add(property)
        db_session.commit()
    
    logger.debug("❌ Negative cost rejected")
    
    logger.info("✅ Property validation test completed") 