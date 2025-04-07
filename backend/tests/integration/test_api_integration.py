import pytest
from app import create_app
from models import db, User, Property, Phase
import json
from datetime import datetime

@pytest.fixture
def test_client():
    """Create a test client for making requests"""
    app = create_app()
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

@pytest.fixture
def auth_headers(test_client):
    """Create authentication headers with a valid JWT token"""
    # Create a test user
    user = User(
        email='test@example.com',
        password_hash='dummy_hash',
        first_name='Test',
        last_name='User'
    )
    db.session.add(user)
    db.session.commit()
    
    # Login to get token
    response = test_client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'test_password'
    })
    token = json.loads(response.data)['access_token']
    return {'Authorization': f'Bearer {token}'}

def test_create_property(test_client, auth_headers):
    """Test property creation endpoint"""
    property_data = {
        'address': '123 Test St',
        'purchase_price': 100000,
        'current_phase': 'ACQUISITION'
    }
    
    response = test_client.post(
        '/api/properties',
        json=property_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['address'] == property_data['address']
    assert data['purchase_price'] == property_data['purchase_price']

def test_get_properties(test_client, auth_headers):
    """Test property listing endpoint"""
    # Create test properties
    properties = [
        Property(address='123 Test St', purchase_price=100000),
        Property(address='456 Sample Ave', purchase_price=200000)
    ]
    for prop in properties:
        db.session.add(prop)
    db.session.commit()
    
    response = test_client.get('/api/properties', headers=auth_headers)
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['address'] == '123 Test St'

def test_property_phase_transition(test_client, auth_headers):
    """Test property phase transition"""
    # Create test property
    property = Property(
        address='123 Test St',
        purchase_price=100000,
        current_phase='ACQUISITION'
    )
    db.session.add(property)
    db.session.commit()
    
    phase_data = {
        'new_phase': 'RENOVATION',
        'notes': 'Starting renovation phase'
    }
    
    response = test_client.post(
        f'/api/properties/{property.id}/phase',
        json=phase_data,
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['current_phase'] == 'RENOVATION'
    
    # Verify phase history
    phase = Phase.query.filter_by(property_id=property.id).first()
    assert phase.phase_type == 'RENOVATION'
    assert phase.notes == 'Starting renovation phase' 