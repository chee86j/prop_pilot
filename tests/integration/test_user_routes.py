import pytest
from models import db, User
from flask_jwt_extended import create_access_token
import logging

logger = logging.getLogger(__name__)

TEST_USER_DATA = {
    'email': 'test@example.com',
    'password': 'test_password',
    'first_name': 'Test',
    'last_name': 'User',
    'avatar': 'https://example.com/avatar.jpg'
}

@pytest.fixture
def test_user(db_session):
    """Create a test user and return it"""
    logger.info('🔧 Creating test user')
    user = User(
        email=TEST_USER_DATA['email'],
        first_name=TEST_USER_DATA['first_name'],
        last_name=TEST_USER_DATA['last_name'],
        avatar=TEST_USER_DATA['avatar']
    )
    user.set_password(TEST_USER_DATA['password'])
    db_session.add(user)
    db_session.commit()
    logger.info('✅ Test user created')
    return user

@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers with JWT token"""
    logger.info('🔑 Creating auth headers')
    access_token = create_access_token(identity=test_user.email)
    headers = {'Authorization': f'Bearer {access_token}'}
    logger.info('✅ Auth headers created')
    return headers

@pytest.mark.integration
def test_get_profile(client, test_user, auth_headers):
    """Test getting user profile"""
    logger.info('🔍 Testing get profile')
    response = client.get('/api/profile', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert data['email'] == TEST_USER_DATA['email']
    assert data['first_name'] == TEST_USER_DATA['first_name']
    assert data['last_name'] == TEST_USER_DATA['last_name']
    assert data['avatar'] == TEST_USER_DATA['avatar']
    logger.info('✅ Get profile test passed')

@pytest.mark.integration
def test_update_profile(client, test_user, auth_headers):
    """Test updating user profile"""
    logger.info('✏️ Testing profile update')
    update_data = {
        'first_name': 'Updated',
        'last_name': 'Name',
        'avatar': 'https://example.com/new-avatar.jpg'
    }
    response = client.put('/api/profile', json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == 'Profile updated successfully'

    # Verify changes
    response = client.get('/api/profile', headers=auth_headers)
    data = response.json
    assert data['first_name'] == update_data['first_name']
    assert data['last_name'] == update_data['last_name']
    assert data['avatar'] == update_data['avatar']
    logger.info('✅ Profile update test passed')

@pytest.mark.integration
def test_update_password(client, test_user, auth_headers):
    """Test updating user password"""
    logger.info('🔒 Testing password update')
    password_data = {
        'current_password': TEST_USER_DATA['password'],
        'new_password': 'new_secure_password'
    }
    response = client.put('/api/profile/password', json=password_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == 'Password updated successfully'
    logger.info('✅ Password update test passed')

@pytest.mark.integration
def test_invalid_password_update(client, test_user, auth_headers):
    """Test updating password with invalid current password"""
    logger.info('❌ Testing invalid password update')
    password_data = {
        'current_password': 'wrong_password',
        'new_password': 'new_secure_password'
    }
    response = client.put('/api/profile/password', json=password_data, headers=auth_headers)
    assert response.status_code == 401
    assert response.json['message'] == 'Invalid password'
    logger.info('✅ Invalid password update test passed')

@pytest.mark.integration
def test_profile_not_found(client):
    """Test accessing profile that doesn't exist"""
    logger.info('🔍 Testing non-existent profile access')
    # Create token for non-existent user
    access_token = create_access_token(identity='nonexistent@example.com')
    headers = {'Authorization': f'Bearer {access_token}'}
    
    response = client.get('/api/profile', headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'User not found'
    logger.info('✅ Non-existent profile test passed')

@pytest.mark.integration
def test_unauthorized_access(client):
    """Test accessing profile without authentication"""
    logger.info('🚫 Testing unauthorized access')
    response = client.get('/api/profile')
    assert response.status_code == 401
    logger.info('✅ Unauthorized access test passed') 