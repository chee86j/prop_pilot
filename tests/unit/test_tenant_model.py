import pytest
from models import Tenant, Lease, Property, User
from datetime import date, timedelta
from models.tenant import ValidationError
import uuid

# Test data for parametrized tests
TENANT_TEST_DATA = [
    {
        'firstName': 'John',
        'lastName': 'Doe',
        'email': f'john_{str(uuid.uuid4())[:8]}@example.com',
        'dateOfBirth': date(1990, 1, 1),
        'phoneNumber': '123-456-7890',
        'occupation': 'Software Engineer',
        'creditScoreAtInitialApplication': 750,
        'creditCheck1Complete': True,
        'description': 'tenant with high credit score'
    },
    {
        'firstName': 'Jane',
        'lastName': 'Smith',
        'email': f'jane_{str(uuid.uuid4())[:8]}@example.com',
        'dateOfBirth': date(1985, 6, 15),
        'phoneNumber': '987-654-3210',
        'occupation': 'Marketing Manager',
        'creditScoreAtInitialApplication': 680,
        'creditCheck1Complete': True,
        'description': 'tenant with medium credit score'
    },
    {
        'firstName': 'Bob',
        'lastName': 'Johnson',
        'email': f'bob_{str(uuid.uuid4())[:8]}@example.com',
        'dateOfBirth': date(1995, 12, 31),
        'phoneNumber': '555-555-5555',
        'occupation': 'Teacher',
        'creditScoreAtInitialApplication': 800,
        'creditCheck1Complete': False,
        'description': 'tenant pending credit check'
    }
]

LEASE_TEST_DATA = [
    {
        'startDate': date.today(),
        'endDate': date.today() + timedelta(days=365),
        'monthlyRent': 1500,
        'securityDeposit': 1500,
        'description': 'standard one-year lease'
    },
    {
        'startDate': date.today() + timedelta(days=30),
        'endDate': date.today() + timedelta(days=730),
        'monthlyRent': 2000,
        'securityDeposit': 2000,
        'description': 'two-year lease with future start'
    }
]

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("tenant_data", TENANT_TEST_DATA)
def test_new_tenant(db_session, logger, tenant_data):
    """Test creating a new tenant"""
    logger.info(f"👥 Starting new tenant test for {tenant_data['description']}...")
    
    tenant = Tenant(
        firstName=tenant_data['firstName'],
        lastName=tenant_data['lastName'],
        email=tenant_data['email'],
        dateOfBirth=tenant_data['dateOfBirth'],
        phoneNumber=tenant_data['phoneNumber'],
        occupation=tenant_data['occupation'],
        creditScoreAtInitialApplication=tenant_data['creditScoreAtInitialApplication'],
        creditCheck1Complete=tenant_data['creditCheck1Complete']
    )
    
    logger.debug(f"📧 {tenant.email = }")
    logger.debug(f"📱 {tenant.phoneNumber = }")
    logger.debug(f"💳 {tenant.creditScoreAtInitialApplication = }")
    
    db_session.add(tenant)
    db_session.commit()

    retrieved_tenant = Tenant.query.filter_by(email=tenant_data['email']).first()
    assert retrieved_tenant is not None
    assert retrieved_tenant.firstName == tenant_data['firstName']
    assert retrieved_tenant.lastName == tenant_data['lastName']
    assert retrieved_tenant.creditScoreAtInitialApplication == tenant_data['creditScoreAtInitialApplication']
    assert retrieved_tenant.creditCheck1Complete == tenant_data['creditCheck1Complete']
    
    logger.info(f"✅ New tenant test completed for {tenant_data['description']}")

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("lease_data", LEASE_TEST_DATA)
def test_tenant_lease_relationship(db_session, test_property, logger, lease_data):
    """Test tenant-lease relationship"""
    logger.info(f"🔗 Starting tenant-lease relationship test for {lease_data['description']}...")
    
    # Create a tenant
    unique_id = str(uuid.uuid4())[:8]
    tenant = Tenant(
        firstName="Test",
        lastName="Tenant",
        email=f"test_{unique_id}@example.com",
        dateOfBirth=date(1990, 1, 1),
        phoneNumber="123-456-7890"
    )
    db_session.add(tenant)
    db_session.commit()

    logger.debug(f"👥 Created tenant with ID: {tenant.id}")

    # Create a lease
    lease = Lease(
        tenantId=tenant.id,
        propertyId=test_property.id,
        startDate=lease_data['startDate'],
        endDate=lease_data['endDate'],
        rentAmount=lease_data['monthlyRent'],
        typeOfLease='Fixed'
    )
    db_session.add(lease)
    db_session.commit()

    logger.debug(f"📄 Created lease with ID: {lease.id}")
    logger.debug(f"💰 Monthly rent: ${lease_data['monthlyRent']}")

    # Test relationships
    assert len(tenant.leases) == 1
    assert tenant.leases[0].rentAmount == lease_data['monthlyRent']
    assert tenant.leases[0].propertyId == test_property.id
    
    # Test reverse relationship
    assert lease.tenant == tenant
    assert lease.property == test_property
    
    logger.info(f"✅ Tenant-lease relationship test completed for {lease_data['description']}")

@pytest.mark.model
@pytest.mark.unit
def test_tenant_validation(db_session, logger):
    """Test tenant data validation"""
    logger.info("✔️ Starting tenant validation test...")
    
    # Test invalid email
    with pytest.raises(ValidationError, match='Invalid email format'):
        tenant = Tenant(
            firstName="Test",
            lastName="Tenant",
            email="invalid-email",
            dateOfBirth=date(1990, 1, 1),
            phoneNumber="123-456-7890"
        )
        db_session.add(tenant)
        db_session.commit()
    
    logger.debug("❌ Invalid email rejected")
    db_session.rollback()

    # Test invalid phone number
    with pytest.raises(ValidationError, match='Phone number must be 10-11 digits'):
        tenant = Tenant(
            firstName="Test",
            lastName="Tenant",
            email="test@example.com",
            dateOfBirth=date(1990, 1, 1),
            phoneNumber="123"  # Too short
        )
        db_session.add(tenant)
        db_session.commit()
    
    logger.debug("❌ Invalid phone number rejected")
    db_session.rollback()

    # Test invalid credit score (too high)
    with pytest.raises(ValidationError, match='Credit score must be between 300 and 850'):
        tenant = Tenant(
            firstName="Test",
            lastName="Tenant",
            email="test@example.com",
            dateOfBirth=date(1990, 1, 1),
            phoneNumber="123-456-7890",
            creditScoreAtInitialApplication=900  # Score too high
        )
        db_session.add(tenant)
        db_session.commit()
    
    logger.debug("❌ Invalid credit score (too high) rejected")
    db_session.rollback()

    # Test invalid credit score (too low)
    with pytest.raises(ValidationError, match='Credit score must be between 300 and 850'):
        tenant = Tenant(
            firstName="Test",
            lastName="Tenant",
            email="test@example.com",
            dateOfBirth=date(1990, 1, 1),
            phoneNumber="123-456-7890",
            creditScoreAtInitialApplication=200  # Score too low
        )
        db_session.add(tenant)
        db_session.commit()
    
    logger.debug("❌ Invalid credit score (too low) rejected")
    db_session.rollback()

    # Test underage tenant
    with pytest.raises(ValidationError, match='Tenant must be at least 18 years old'):
        tenant = Tenant(
            firstName="Test",
            lastName="Tenant",
            email="test@example.com",
            dateOfBirth=date.today() - timedelta(days=365*17),  # 17 years old
            phoneNumber="123-456-7890"
        )
        db_session.add(tenant)
        db_session.commit()
    
    logger.debug("❌ Underage tenant rejected")
    db_session.rollback()

    # Test invalid name (special characters)
    with pytest.raises(ValidationError, match='Names can only contain letters, spaces, hyphens and apostrophes'):
        tenant = Tenant(
            firstName="Test123",  # Contains numbers
            lastName="Tenant",
            email="test@example.com",
            dateOfBirth=date(1990, 1, 1),
            phoneNumber="123-456-7890"
        )
        db_session.add(tenant)
        db_session.commit()
    
    logger.debug("❌ Invalid name rejected")
    db_session.rollback()

    # Test valid tenant with all fields
    tenant = Tenant(
        firstName="John-O'Brien",  # Test hyphen and apostrophe
        lastName="Smith",
        email="john.obrien@example.com",
        dateOfBirth=date(1990, 1, 1),
        phoneNumber="123-456-7890",
        occupation="Software Engineer",
        creditScoreAtInitialApplication=750,
        creditCheck1Complete=True
    )
    db_session.add(tenant)
    db_session.commit()
    
    logger.debug("✅ Valid tenant accepted")
    
    # Test valid tenant with optional fields
    tenant = Tenant(
        firstName="Jane",
        lastName="Doe",
        email="jane.doe@example.com",
        dateOfBirth=date(1990, 1, 1),  # Only required fields
    )
    db_session.add(tenant)
    db_session.commit()
    
    logger.debug("✅ Valid tenant with minimal fields accepted")
    
    logger.info("✅ Tenant validation test completed")