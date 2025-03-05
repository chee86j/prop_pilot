import pytest
from models import User, db, Receipt, ConstructionDraw, Phase, PropertyMaintenanceRequest, Lease, Property, Tenant
from flask import current_app
from unittest.mock import patch
import logging
import json
from datetime import date, timedelta
from flask_jwt_extended import create_access_token

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

# Add new test data for email validation
EMAIL_VALIDATION_TEST_DATA = [
    ('valid@example.com', True, 'standard email'),
    ('valid.email@sub.example.com', True, 'email with subdomain'),
    ('valid+label@example.com', True, 'email with plus label'),
    ('invalid@email', False, 'missing TLD'),
    ('invalid.email', False, 'missing @ symbol'),
    ('invalid@.com', False, 'missing domain'),
    ('invalid@domain.', False, 'TLD with only dot'),
    ('', False, 'empty string'),
    ('@example.com', False, 'missing local part'),
    ('spaces in@email.com', False, 'spaces in local part')
]

# Add new test data for login validation
LOGIN_TEST_DATA = [
    ({}, 400, 'missing all fields'),
    ({'email': 'test@example.com'}, 400, 'missing password'),
    ({'password': 'password123'}, 400, 'missing email'),
    ({'email': '', 'password': ''}, 400, 'empty fields'),
    ({'email': 'nonexistent@example.com', 'password': 'password123'}, 401, 'non-existent user'),
    ({'email': 'test@example.com', 'password': 'wrongpassword'}, 401, 'wrong password')
]

# Add new test data for Google auth
GOOGLE_AUTH_TEST_DATA = [
    {
        'token': 'valid_token',
        'user_info': {
            'email': 'new.user@gmail.com',
            'given_name': 'New',
            'family_name': 'User'
        },
        'expected_status': 200,
        'description': 'new Google user'
    },
    {
        'token': 'existing_user_token',
        'user_info': {
            'email': 'existing@gmail.com',
            'given_name': 'Existing',
            'family_name': 'User'
        },
        'expected_status': 200,
        'description': 'existing Google user'
    }
]

# Add new test data for password validation
PASSWORD_VALIDATION_TEST_DATA = [
    ('short', False, 'too short'),
    ('password123', True, 'valid password'),
    ('', False, 'empty password'),
    ('a' * 7, False, 'just under minimum length'),
    ('a' * 8, True, 'minimum length'),
    ('a' * 100, True, 'long password')
]

# Add new test data for database errors
DB_ERROR_TEST_DATA = [
    ('IntegrityError', 409, 'Email Already registered'),
    ('OperationalError', 500, 'An Error Occurred'),
    ('SQLAlchemyError', 500, 'An Error Occurred')
]

@pytest.fixture(autouse=True)
def cleanup_users(db_session):
    """Clean up users before each test"""
    logger.info('🧹 Cleaning up users')
    try:
        # Delete all users
        db_session.query(User).delete()
        db_session.commit()
        logger.info('✅ Users cleaned up')
    except Exception as e:
        logger.error(f'❌ Error cleaning up users: {e}')
        db_session.rollback()
    yield
    try:
        # Cleanup after test
        db_session.query(User).delete()
        db_session.commit()
    except Exception as e:
        logger.error(f'❌ Error cleaning up users after test: {e}')
        db_session.rollback()

@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers with JWT token"""
    logger.info('🔑 Creating auth headers')
    access_token = create_access_token(identity=test_user.email)
    headers = {'Authorization': f'Bearer {access_token}'}
    logger.info('✅ Auth headers created')
    return headers

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

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("email,expected,description", EMAIL_VALIDATION_TEST_DATA)
def test_validate_email(email, expected, description):
    """Test email validation function"""
    logger.info(f"📧 Testing email validation for {description}")
    from routes.auth import validate_email
    
    result = validate_email(email)
    assert result == expected, f"Email validation failed for {description}"
    
    logger.info(f"✅ Email validation test completed for {description}")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("login_data,expected_status,description", LOGIN_TEST_DATA)
def test_login_validation(client, test_user, logger, login_data, expected_status, description):
    """Test login endpoint with various validation cases"""
    logger.info(f"🔑 Testing login validation for {description}")
    
    if 'email' in login_data and login_data['email'] == 'test@example.com':
        login_data['email'] = test_user.email
    
    response = client.post('/api/login', json=login_data)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == expected_status
    
    if expected_status == 400:
        assert 'Email and password are required' in response.json.get('message', '')
    elif expected_status == 401:
        assert 'Invalid credentials' in response.json.get('message', '')
    
    logger.info(f"✅ Login validation test completed for {description}")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("google_data", GOOGLE_AUTH_TEST_DATA)
def test_google_auth_scenarios(client, db_session, mock_google_verify, logger, google_data):
    """Test Google authentication with various scenarios"""
    logger.info(f"🔑 Testing Google auth for {google_data['description']}")
    
    # If testing existing user, create the user first
    if google_data['description'] == 'existing Google user':
        user = User(
            email=google_data['user_info']['email'],
            first_name=google_data['user_info']['given_name'],
            last_name=google_data['user_info']['family_name']
        )
        db_session.add(user)
        db_session.commit()
    
    # Configure mock to return the test user info
    mock_google_verify.return_value = google_data['user_info']
    
    response = client.post('/api/auth/google', json={
        'credential': google_data['token']
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == google_data['expected_status']
    assert 'access_token' in response.json
    assert response.json['user']['email'] == google_data['user_info']['email']
    assert response.json['user']['first_name'] == google_data['user_info']['given_name']
    assert response.json['user']['last_name'] == google_data['user_info']['family_name']
    
    # Verify user was created/updated in database
    user = User.query.filter_by(email=google_data['user_info']['email']).first()
    assert user is not None
    assert user.first_name == google_data['user_info']['given_name']
    assert user.last_name == google_data['user_info']['family_name']
    
    logger.info(f"✅ Google auth test completed for {google_data['description']}")

@pytest.mark.api
@pytest.mark.integration
def test_google_auth_invalid_token(client, mock_google_verify, logger):
    """Test Google authentication with invalid token"""
    logger.info("❌ Testing Google auth with invalid token")
    
    # Configure mock to raise ValueError
    mock_google_verify.side_effect = ValueError('Invalid token')
    
    response = client.post('/api/auth/google', json={
        'credential': 'invalid_token'
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == 401
    assert response.json['error'] == 'Invalid token'
    
    logger.info("✅ Invalid token test completed")

@pytest.mark.api
@pytest.mark.integration
def test_google_auth_missing_token(client, logger):
    """Test Google authentication with missing token"""
    logger.info("❌ Testing Google auth with missing token")
    
    response = client.post('/api/auth/google', json={})
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == 400
    assert 'error' in response.json
    
    logger.info("✅ Missing token test completed")

@pytest.mark.api
@pytest.mark.integration
def test_google_auth_server_error(client, mock_google_verify, logger):
    """Test Google authentication with server error"""
    logger.info("❌ Testing Google auth with server error")
    
    # Configure mock to raise an unexpected error
    mock_google_verify.side_effect = Exception('Unexpected error')
    
    response = client.post('/api/auth/google', json={
        'credential': 'valid_token'
    })
    
    logger.debug(f"📤 Response status: {response.status_code}")
    logger.debug(f"📤 Response data: {response.json}")
    
    assert response.status_code == 500
    assert 'error' in response.json
    
    logger.info("✅ Server error test completed")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("password,expected,description", PASSWORD_VALIDATION_TEST_DATA)
def test_validate_password(password, expected, description):
    """Test password validation function"""
    logger.info(f"🔒 Testing password validation for {description}")
    from routes.auth import validate_password
    
    result = validate_password(password)
    assert result == expected, f"Password validation failed for {description}"
    
    logger.info(f"✅ Password validation test completed for {description}")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("error_type,expected_status,expected_message", DB_ERROR_TEST_DATA)
def test_register_database_errors(client, db_session, monkeypatch, error_type, expected_status, expected_message):
    """Test registration with database errors"""
    logger.info(f"❌ Testing registration with {error_type}")
    
    def mock_commit():
        if error_type == 'IntegrityError':
            from sqlalchemy.exc import IntegrityError
            raise IntegrityError(None, None, None)
        elif error_type == 'OperationalError':
            from sqlalchemy.exc import OperationalError
            raise OperationalError(None, None, None)
        else:
            from sqlalchemy.exc import SQLAlchemyError
            raise SQLAlchemyError()
    
    monkeypatch.setattr(db_session, 'commit', mock_commit)
    
    response = client.post('/api/register', json=TEST_USER_DATA)
    
    assert response.status_code == expected_status
    assert response.json['message'] == expected_message
    
    logger.info(f"✅ Database error test completed for {error_type}")

@pytest.mark.api
@pytest.mark.integration
def test_expired_token(client, test_user):
    """Test authentication with expired token"""
    logger.info("⏰ Testing expired token")
    
    # Create an expired token
    from datetime import timedelta
    access_token = create_access_token(
        identity=test_user.email,
        expires_delta=timedelta(seconds=-1)
    )
    
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/api/profile', headers=headers)
    
    assert response.status_code == 401
    assert 'Token has expired' in str(response.json.get('msg', ''))
    
    logger.info("✅ Expired token test completed")

@pytest.mark.api
@pytest.mark.integration
def test_malformed_token(client):
    """Test authentication with malformed token"""
    logger.info("🔧 Testing malformed token")
    
    headers = {'Authorization': 'Bearer invalid.token.format'}
    response = client.get('/api/profile', headers=headers)
    
    assert response.status_code == 422
    assert 'Invalid token' in str(response.json.get('msg', ''))
    
    logger.info("✅ Malformed token test completed")

@pytest.mark.api
@pytest.mark.integration
def test_google_auth_timeout(client, mock_google_verify):
    """Test Google authentication with timeout"""
    logger.info("⏱️ Testing Google auth timeout")
    
    from requests.exceptions import Timeout
    mock_google_verify.side_effect = Timeout('Connection timed out')
    
    response = client.post('/api/auth/google', json={
        'credential': 'valid_token'
    })
    
    assert response.status_code == 500
    assert 'error' in response.json
    
    logger.info("✅ Google auth timeout test completed")

@pytest.mark.api
@pytest.mark.integration
def test_concurrent_registration(client, db_session):
    """Test concurrent user registration"""
    logger.info("🔄 Testing concurrent registration")
    
    # Simulate a race condition by creating the user after validation but before commit
    original_commit = db_session.commit
    
    def delayed_commit():
        # Create the same user in "another session"
        user = User(
            email=TEST_USER_DATA['email'],
            first_name=TEST_USER_DATA['first_name'],
            last_name=TEST_USER_DATA['last_name']
        )
        user.set_password(TEST_USER_DATA['password'])
        db_session.add(user)
        original_commit()
        
        # Now try the original commit
        original_commit()
    
    db_session.commit = delayed_commit
    
    response = client.post('/api/register', json=TEST_USER_DATA)
    
    assert response.status_code == 409
    assert response.json['message'] == 'Email Already registered'
    
    logger.info("✅ Concurrent registration test completed")

@pytest.mark.api
@pytest.mark.integration
def test_profile_unauthorized(client):
    """Test accessing profile without authentication"""
    logger.info('🔒 Testing unauthorized profile access')
    response = client.get('/api/profile')
    assert response.status_code == 401
    logger.info('✅ Unauthorized profile access test completed')

@pytest.mark.api
@pytest.mark.integration
def test_profile_access(client, test_user, auth_headers):
    """Test accessing profile with valid authentication"""
    logger.info('👤 Testing profile access')
    response = client.get('/api/profile', headers=auth_headers)
    assert response.status_code == 200
    assert response.json['email'] == test_user.email
    assert response.json['first_name'] == test_user.first_name
    assert response.json['last_name'] == test_user.last_name
    logger.info('✅ Profile access test completed')

@pytest.mark.api
@pytest.mark.integration
def test_profile_update(client, test_user, auth_headers):
    """Test updating profile"""
    logger.info('✏️ Testing profile update')
    update_data = {
        'first_name': 'Updated',
        'last_name': 'Name',
        'avatar': 'new_avatar.jpg'
    }
    response = client.put('/api/profile', json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert 'Profile updated successfully' in response.json['message']

    # Verify changes
    user = User.query.filter_by(email=test_user.email).first()
    assert user.first_name == update_data['first_name']
    assert user.last_name == update_data['last_name']
    assert user.avatar == update_data['avatar']
    logger.info('✅ Profile update test completed')

@pytest.mark.api
@pytest.mark.integration
def test_password_update(client, test_user, auth_headers):
    """Test updating password"""
    logger.info('🔑 Testing password update')
    update_data = {
        'current_password': 'password123',
        'new_password': 'newpassword123'
    }
    response = client.put('/api/profile/password', json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert 'Password updated successfully' in response.json['message']

    # Verify new password works
    login_response = client.post('/api/login', json={
        'email': test_user.email,
        'password': 'newpassword123'
    })
    assert login_response.status_code == 200
    logger.info('✅ Password update test completed')

@pytest.mark.api
@pytest.mark.integration
def test_password_update_invalid(client, test_user, auth_headers):
    """Test updating password with invalid current password"""
    logger.info('❌ Testing password update with invalid current password')
    update_data = {
        'current_password': 'wrongpassword',
        'new_password': 'newpassword123'
    }
    response = client.put('/api/profile/password', json=update_data, headers=auth_headers)
    assert response.status_code == 401
    assert 'Invalid password' in response.json['message']
    logger.info('✅ Invalid password update test completed')

@pytest.mark.api
@pytest.mark.integration
def test_profile_not_found(client):
    """Test accessing profile of non-existent user"""
    logger.info('🔍 Testing profile access for non-existent user')
    # Create token for non-existent user
    access_token = create_access_token(identity='nonexistent@example.com')
    headers = {'Authorization': f'Bearer {access_token}'}
    
    response = client.get('/api/profile', headers=headers)
    assert response.status_code == 404
    assert 'User not found' in response.json['message']
    logger.info('✅ Non-existent user profile test completed')

@pytest.mark.api
@pytest.mark.integration
def test_profile_update_error(client, test_user, auth_headers, monkeypatch):
    """Test profile update with database error"""
    logger.info('❌ Testing profile update with database error')
    
    def mock_commit():
        raise Exception('Database error')
    
    monkeypatch.setattr(db.session, 'commit', mock_commit)
    
    update_data = {
        'first_name': 'Updated',
        'last_name': 'Name'
    }
    response = client.put('/api/profile', json=update_data, headers=auth_headers)
    assert response.status_code == 500
    assert 'error' in response.json
    logger.info('✅ Profile update error test completed') 