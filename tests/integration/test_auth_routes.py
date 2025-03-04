import pytest
from models import User, db
from flask import current_app
from unittest.mock import patch
import logging
import json

logger = logging.getLogger(__name__)

# Test data for parametrized tests
USER_REGISTRATION_TEST_DATA = [
    {
        'first_name': 'John',
        'last_name': 'Smith',
        'email': 'john.smith@example.com',
        'password': 'SecurePass123!',
        'expected_status': 201,
        'description': 'valid registration'
    },
    {
        'first_name': 'Jane',
        'last_name': 'Doe',
        'email': 'jane.doe@example.com',
        'password': 'StrongPass456!',
        'expected_status': 201,
        'description': 'valid registration with different data'
    }
]

INVALID_REGISTRATION_TEST_DATA = [
    {
        'first_name': '',
        'last_name': 'User',
        'email': 'test@example.com',
        'password': 'TestPass123!',
        'expected_status': 400,
        'description': 'missing first name'
    },
    {
        'first_name': 'Test',
        'last_name': '',
        'email': 'test@example.com',
        'password': 'TestPass123!',
        'expected_status': 400,
        'description': 'missing last name'
    },
    {
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'invalid-email',
        'password': 'TestPass123!',
        'expected_status': 400,
        'description': 'invalid email format'
    },
    {
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'test@example.com',
        'password': '123',
        'expected_status': 400,
        'description': 'password too short'
    }
]

TEST_USER_DATA = {
    'email': 'test@example.com',
    'password': 'test_password_123',
    'first_name': 'Test',
    'last_name': 'User'
}

GOOGLE_USER_DATA = {
    'email': 'google@example.com',
    'given_name': 'Google',
    'family_name': 'User',
    'sub': '12345'
}

@pytest.fixture(autouse=True)
def cleanup_users(db_session):
    """Clean up users before each test"""
    logger.info('🧹 Cleaning up users')
    db_session.query(User).delete()
    db_session.commit()
    logger.info('✅ Users cleaned up')
    yield
    # Cleanup after test
    db_session.query(User).delete()
    db_session.commit()

@pytest.fixture
def mock_google_verify():
    """Mock Google token verification"""
    with patch('google.oauth2.id_token.verify_oauth2_token') as mock:
        mock.return_value = GOOGLE_USER_DATA
        yield mock

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("user_data", USER_REGISTRATION_TEST_DATA)
def test_user_registration(app, client, db_session, logger, user_data):
    """Test successful user registration with various valid data"""
    logger.info(f"🔐 Starting user registration test for {user_data['description']}...")
    
    response = client.post('/api/register', json={
        'first_name': user_data['first_name'],
        'last_name': user_data['last_name'],
        'email': user_data['email'],
        'password': user_data['password']
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == user_data['expected_status']
    assert 'User Created successfully' in response.json['message']
    
    # Verify user was created in database
    with app.app_context():
        user = User.query.filter_by(email=user_data['email']).first()
        assert user is not None
        assert user.first_name == user_data['first_name']
        assert user.last_name == user_data['last_name']
    
    logger.info(f"✅ User registration test completed for {user_data['description']}")

@pytest.mark.api
@pytest.mark.integration
def test_duplicate_registration(app, client, test_user, logger):
    """Test registration with duplicate email"""
    logger.info("🔄 Starting duplicate registration test...")
    
    response = client.post('/api/register', json={
        'first_name': 'Test',
        'last_name': 'User',
        'email': test_user.email,
        'password': 'TestPass123!'
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📧 Attempted duplicate email: {test_user.email}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == 409
    assert 'Email Already registered' in response.json.get('message', '')
    
    logger.info("✅ Duplicate registration test completed")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("invalid_data", INVALID_REGISTRATION_TEST_DATA)
def test_invalid_registration(app, client, logger, invalid_data):
    """Test registration with invalid data"""
    logger.info(f"❌ Starting invalid registration test for {invalid_data['description']}...")
    
    response = client.post('/api/register', json={
        'first_name': invalid_data['first_name'],
        'last_name': invalid_data['last_name'],
        'email': invalid_data['email'],
        'password': invalid_data['password']
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == invalid_data['expected_status']
    
    logger.info(f"✅ Invalid registration test completed for {invalid_data['description']}")

@pytest.mark.api
@pytest.mark.integration
def test_login_success(app, client, test_user, logger):
    """Test successful login"""
    logger.info("🔑 Starting successful login test...")
    
    response = client.post('/api/login', json={
        'email': test_user.email,
        'password': 'password123'  # This matches the password set in test_user fixture
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == 200
    assert 'access_token' in response.json
    
    logger.info("✅ Login success test completed")

@pytest.mark.api
@pytest.mark.integration
def test_login_invalid_credentials(app, client, test_user, logger):
    """Test login with invalid credentials"""
    logger.info("🔒 Starting invalid credentials login test...")
    
    response = client.post('/api/login', json={
        'email': test_user.email,
        'password': 'wrongpassword'
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == 401
    assert 'Invalid credentials' in response.json.get('message', '')
    
    logger.info("✅ Invalid credentials test completed")

@pytest.mark.integration
def test_register_success(client):
    """Test successful user registration"""
    logger.info('📝 Testing user registration')
    response = client.post('/api/register', json=TEST_USER_DATA)
    assert response.status_code == 201
    assert response.json['message'] == 'User Created successfully'

    # Verify user was created in database
    user = User.query.filter_by(email=TEST_USER_DATA['email']).first()
    assert user is not None
    assert user.first_name == TEST_USER_DATA['first_name']
    assert user.last_name == TEST_USER_DATA['last_name']
    logger.info('✅ User registration test passed')

@pytest.mark.integration
def test_register_duplicate_email(client):
    """Test registration with existing email"""
    logger.info('📝 Testing duplicate email registration')
    # First registration
    client.post('/api/register', json=TEST_USER_DATA)
    
    # Attempt duplicate registration
    response = client.post('/api/register', json=TEST_USER_DATA)
    assert response.status_code == 409
    assert response.json['message'] == 'Email Already registered'
    logger.info('✅ Duplicate email test passed')

@pytest.mark.integration
@pytest.mark.parametrize('invalid_data,expected_message', [
    ({'email': 'invalid-email', 'password': 'test_password_123', 'first_name': 'Test', 'last_name': 'User'},
     'Valid email is required'),
    ({'email': 'test@example.com', 'password': 'short', 'first_name': 'Test', 'last_name': 'User'},
     'Password must be at least 8 characters'),
    ({'email': 'test@example.com', 'password': 'test_password_123', 'last_name': 'User'},
     'First name is required'),
    ({'email': 'test@example.com', 'password': 'test_password_123', 'first_name': 'Test'},
     'Last name is required'),
])
def test_register_validation(client, invalid_data, expected_message):
    """Test registration input validation"""
    logger.info(f'❌ Testing registration validation: {expected_message}')
    response = client.post('/api/register', json=invalid_data)
    assert response.status_code == 400
    assert response.json['message'] == expected_message
    logger.info('✅ Registration validation test passed')

@pytest.mark.integration
def test_login_success(client):
    """Test successful login"""
    logger.info('🔑 Testing user login')
    # Register user first
    client.post('/api/register', json=TEST_USER_DATA)
    
    # Attempt login
    response = client.post('/api/login', json={
        'email': TEST_USER_DATA['email'],
        'password': TEST_USER_DATA['password']
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
    logger.info('✅ Login test passed')

@pytest.mark.integration
def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    logger.info('🔒 Testing invalid login credentials')
    # Register user first
    client.post('/api/register', json=TEST_USER_DATA)
    
    # Test wrong password
    response = client.post('/api/login', json={
        'email': TEST_USER_DATA['email'],
        'password': 'wrong_password'
    })
    assert response.status_code == 401
    assert response.json['message'] == 'Invalid credentials'

    # Test non-existent user
    response = client.post('/api/login', json={
        'email': 'nonexistent@example.com',
        'password': TEST_USER_DATA['password']
    })
    assert response.status_code == 401
    assert response.json['message'] == 'Invalid credentials'
    logger.info('✅ Invalid credentials test passed')

@pytest.mark.integration
def test_login_missing_fields(client):
    """Test login with missing fields"""
    logger.info('❌ Testing login with missing fields')
    response = client.post('/api/login', json={})
    assert response.status_code == 400
    assert response.json['message'] == 'Email and password are required'
    logger.info('✅ Missing fields test passed')

@pytest.mark.integration
def test_google_auth_success(client, mock_google_verify):
    """Test successful Google authentication"""
    logger.info('🔑 Testing Google authentication')
    response = client.post('/api/auth/google', json={
        'credential': 'mock_google_token'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert response.json['user']['email'] == GOOGLE_USER_DATA['email']
    assert response.json['user']['first_name'] == GOOGLE_USER_DATA['given_name']
    assert response.json['user']['last_name'] == GOOGLE_USER_DATA['family_name']

    # Verify user was created
    user = User.query.filter_by(email=GOOGLE_USER_DATA['email']).first()
    assert user is not None
    logger.info('✅ Google authentication test passed')

@pytest.mark.integration
def test_google_auth_existing_user(client, mock_google_verify):
    """Test Google authentication with existing user"""
    logger.info('🔄 Testing Google authentication with existing user')
    # First Google auth
    client.post('/api/auth/google', json={'credential': 'mock_google_token'})
    
    # Second Google auth
    response = client.post('/api/auth/google', json={'credential': 'mock_google_token'})
    assert response.status_code == 200
    assert 'access_token' in response.json
    
    # Verify only one user exists
    user_count = User.query.filter_by(email=GOOGLE_USER_DATA['email']).count()
    assert user_count == 1
    logger.info('✅ Google auth existing user test passed')

@pytest.mark.integration
def test_google_auth_invalid_token(client, mock_google_verify):
    """Test Google authentication with invalid token"""
    logger.info('❌ Testing Google authentication with invalid token')
    mock_google_verify.side_effect = ValueError('Invalid token')
    
    response = client.post('/api/auth/google', json={'credential': 'invalid_token'})
    assert response.status_code == 401
    assert response.json['error'] == 'Invalid token'
    logger.info('✅ Invalid Google token test passed') 