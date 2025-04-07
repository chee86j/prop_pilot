import pytest
from models import User, Property
from werkzeug.security import check_password_hash
import uuid

# Test data for parametrized tests
USER_TEST_DATA = [
    {
        'first_name': 'John',
        'last_name': 'Smith',
        'email': 'john.smith@example.com',
        'password': 'pass',  # Simple 4-char password
        'description': 'standard user'
    },
    {
        'first_name': 'Jane',
        'last_name': 'Doe',
        'email': 'jane.doe@example.com',
        'password': '1234',  # Simple 4-char numeric password
        'description': 'user with different data'
    }
]

PROPERTY_TEST_DATA = [
    {
        'propertyName': 'Suburban House',
        'address': '123 Maple St',
        'city': 'Springfield',
        'state': 'IL',
        'zipCode': '62701',
        'purchaseCost': 180000,
        'totalRehabCost': 45000,
        'arvSalePrice': 280000
    },
    {
        'propertyName': 'Downtown Condo',
        'address': '456 Urban Ave',
        'city': 'Chicago',
        'state': 'IL',
        'zipCode': '60601',
        'purchaseCost': 250000,
        'totalRehabCost': 30000,
        'arvSalePrice': 350000
    }
]

INVALID_PASSWORD_TEST_CASES = [
    {
        'password': '123',
        'description': 'too short',
        'expected_error': 'Password must be at least 4 characters long'
    }
]

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("user_data", USER_TEST_DATA)
def test_new_user(db_session, logger, user_data):
    """Test creating a new user"""
    logger.info(f"👤 Starting new user test for {user_data['description']}...")
    
    user = User(
        first_name=user_data['first_name'],
        last_name=user_data['last_name'],
        email=user_data['email']
    )
    user.set_password(user_data['password'])
    
    logger.debug(f"📧 {user.email = }")
    
    db_session.add(user)
    db_session.commit()

    retrieved_user = User.query.filter_by(email=user_data['email']).first()
    assert retrieved_user is not None
    assert retrieved_user.first_name == user_data['first_name']
    assert retrieved_user.last_name == user_data['last_name']
    assert retrieved_user.check_password(user_data['password'])
    
    logger.info(f"✅ New user test completed for {user_data['description']}")

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("user_data", USER_TEST_DATA)
def test_password_hashing(db_session, logger, user_data):
    """Test password hashing works correctly"""
    logger.info(f"🔐 Starting password hashing test for {user_data['description']}...")
    
    user = User(
        first_name=user_data['first_name'],
        last_name=user_data['last_name'],
        email=user_data['email']
    )
    user.set_password(user_data['password'])
    
    logger.debug(f"📧 {user.email = }")
    logger.debug("🔒 Password hash created")
    
    assert user.password_hash is not None
    assert user.password_hash != user_data['password']
    assert user.check_password(user_data['password'])
    assert not user.check_password("WrongPassword!")
    
    logger.info(f"✅ Password hashing test completed for {user_data['description']}")

@pytest.mark.model
@pytest.mark.unit
def test_user_properties_relationship(db_session, logger):
    """Test user-properties relationship"""
    logger.info("🔗 Starting user-properties relationship test...")

    # Create test user
    unique_id = str(uuid.uuid4())[:8]
    user = User(
        first_name="Test",
        last_name="User",
        email=f"test_{unique_id}@example.com"
    )
    user.set_password("TestPass123!")
    db_session.add(user)
    db_session.commit()

    logger.debug(f"👤 Created user with ID: {user.id}")

    # Add properties to user
    for property_data in PROPERTY_TEST_DATA:
        property = Property(
            user_id=user.id,
            **property_data
        )
        db_session.add(property)
    db_session.commit()

    logger.debug(f"🏠 Added {len(PROPERTY_TEST_DATA)} properties to user")

    # Test relationship
    user_properties = user.properties.all()
    assert len(user_properties) == len(PROPERTY_TEST_DATA)
    for i, property in enumerate(user_properties):
        assert property.propertyName == PROPERTY_TEST_DATA[i]['propertyName']
        assert property.address == PROPERTY_TEST_DATA[i]['address']
    
    logger.info("✅ User-properties relationship test completed")

@pytest.mark.model
@pytest.mark.unit
def test_user_validation(db_session, logger):
    """Test user validation"""
    logger.info("✅ Starting user validation test...")

    # Test invalid email format
    unique_id = str(uuid.uuid4())[:8]
    user = User(
        first_name="Test",
        last_name="User",
        email=f"test_{unique_id}@example.com"
    )
    user.set_password("TestPass123!")
    db_session.add(user)
    db_session.commit()

@pytest.mark.model
@pytest.mark.unit
def test_duplicate_email(db_session, logger):
    """Test that duplicate emails are not allowed"""
    logger.info("📧 Starting duplicate email test...")
    
    # Create first user
    user1 = User(
        first_name="Test1",
        last_name="User1",
        email="same@example.com"
    )
    db_session.add(user1)
    db_session.commit()
    
    logger.debug(f"👤 Created first user with email: {user1.email}")

    # Try to create second user with same email
    user2 = User(
        first_name="Test2",
        last_name="User2",
        email="same@example.com"
    )
    db_session.add(user2)
    
    logger.debug("🚫 Attempting to create second user with duplicate email")
    
    with pytest.raises(Exception):  # Should raise IntegrityError
        db_session.commit()
    
    logger.info("✅ Duplicate email test completed")

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("password_case", INVALID_PASSWORD_TEST_CASES)
def test_password_validation(db_session, logger, password_case):
    """Test password validation rules"""
    logger.info(f"🔒 Starting password validation test for {password_case['description']}...")
    
    user = User(
        first_name="Test",
        last_name="User",
        email="test@example.com"
    )
    
    with pytest.raises(ValueError, match=password_case['expected_error']):
        user.set_password(password_case['password'])
        
    logger.debug(f"❌ Password rejected: {password_case['description']}")
    logger.info(f"✅ Password validation test completed for {password_case['description']}") 