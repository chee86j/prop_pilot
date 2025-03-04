import pytest
from datetime import date
from models import Property, Phase, db, User
from flask_jwt_extended import create_access_token
import logging

logger = logging.getLogger(__name__)

# Test data for parametrized tests
PROPERTY_TEST_DATA = [
    {
        "propertyName": "Suburban House",
        "address": "123 Maple St",
        "city": "Springfield",
        "state": "IL",
        "zipCode": "62701",
        "purchaseCost": 180000,
        "totalRehabCost": 45000,
        "arvSalePrice": 280000,
        "status_date": date.today()
    },
    {
        "propertyName": "Downtown Condo",
        "address": "456 Urban Ave",
        "city": "Chicago",
        "state": "IL",
        "zipCode": "60601",
        "purchaseCost": 250000,
        "totalRehabCost": 30000,
        "arvSalePrice": 350000,
        "status_date": date.today()
    }
]

TEST_USER_DATA = {
    'email': 'test@example.com',
    'password': 'test_password_123',
    'first_name': 'Test',
    'last_name': 'User'
}

TEST_PROPERTY_DATA = {
    'propertyName': 'Test Property',
    'address': '123 Test St',
    'city': 'Test City',
    'state': 'IL',
    'zipCode': '12345',
    'county': 'Test County',
    'purchaseCost': 100000.00,
    'totalRehabCost': 50000.00,
    'arvSalePrice': 200000.00,
    'detail_link': 'http://example.com/property',
    'property_id': 'TEST123',
    'sheriff_number': 'SH123',
    'status_date': date(2024, 3, 3),
    'plaintiff': 'Test Bank',
    'defendant': 'Previous Owner',
    'zillow_url': 'http://zillow.com/property',
    'bedroomsDescription': '3 bedrooms',
    'bathroomsDescription': '2 full baths',
    'kitchenDescription': 'Modern kitchen',
    'amenitiesDescription': 'Garage, backyard'
}

@pytest.fixture
def test_user(db_session):
    """Create a test user"""
    logger.info('Creating test user')
    user = User(
        email=TEST_USER_DATA['email'],
        first_name=TEST_USER_DATA['first_name'],
        last_name=TEST_USER_DATA['last_name']
    )
    user.set_password(TEST_USER_DATA['password'])
    db_session.add(user)
    db_session.commit()
    logger.info('Test user created')
    return user

@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers with JWT token"""
    logger.info('Creating auth headers')
    access_token = create_access_token(identity=test_user.email)
    headers = {'Authorization': f'Bearer {access_token}'}
    logger.info('Auth headers created')
    return headers

@pytest.fixture
def test_property(db_session, test_user):
    """Create a test property"""
    logger.info('Creating test property')
    property = Property(
        user_id=test_user.id,
        **TEST_PROPERTY_DATA
    )
    db_session.add(property)
    db_session.commit()
    logger.info('Test property created')
    return property

@pytest.fixture(autouse=True)
def cleanup_properties(db_session):
    """Clean up properties before each test"""
    logger.info('Cleaning up properties')
    db_session.query(Property).delete()
    db_session.commit()
    logger.info('Properties cleaned up')
    yield
    # Cleanup after test
    db_session.query(Property).delete()
    db_session.commit()

@pytest.mark.api
@pytest.mark.integration
def test_get_properties(client, test_user, auth_headers, db_session, logger):
    """Test getting all properties for a user"""
    logger.info("Starting get properties test...")
    
    # Create test properties
    properties = []
    for i in range(3):
        property = Property(
            user_id=test_user.id,
            propertyName=f"Test Property {i}",
            address=f"123 Test St #{i}",
            city="Test City",
            state="IL",
            zipCode="12345",
            purchaseCost=100000,
            totalRehabCost=50000,
            arvSalePrice=200000
        )
        properties.append(property)
        db_session.add(property)
    db_session.commit()

    logger.debug(f"Created {len(properties)} test properties")

    # Test getting properties
    response = client.get('/api/properties', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert len(data) == 3
    assert data[0]['propertyName'] == "Test Property 0"
    assert data[0]['address'] == "123 Test St #0"

    logger.info("Get properties test completed successfully")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("property_data", PROPERTY_TEST_DATA)
def test_add_property(client, test_user, auth_headers, db_session, property_data, logger):
    """Test adding a new property"""
    logger.info(f"Starting add property test for {property_data['propertyName']}...")
    
    response = client.post('/api/properties', 
                         json=property_data,
                         headers=auth_headers)
    
    logger.debug(f"Response status: {response.status_code}")
    
    assert response.status_code == 201
    data = response.json
    assert "id" in data
    assert data["message"] == "Property added successfully"

    # Verify property was added to database
    property = db_session.query(Property).get(data["id"])
    assert property is not None
    assert property.propertyName == property_data["propertyName"]
    assert property.address == property_data["address"]

    logger.info(f"Add property test completed for {property_data['propertyName']}")

@pytest.mark.api
@pytest.mark.integration
def test_get_phases(client, test_user, auth_headers, db_session, logger):
    """Test getting phases for a property"""
    logger.info("Starting get phases test...")
    
    # Create a test property
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="IL",
        zipCode="12345"
    )
    db_session.add(property)
    db_session.commit()

    logger.debug(f"Created test property: {property.propertyName}")

    # Create test phases
    phases = []
    for i in range(2):
        phase = Phase(
            property_id=property.id,
            name=f"Phase {i}",
            startDate=date.today(),
            expectedEndDate=date.today()
        )
        phases.append(phase)
        db_session.add(phase)
    db_session.commit()

    logger.debug(f"Created {len(phases)} test phases")

    # Test getting phases
    response = client.get(f'/api/phases/{property.id}', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    assert data[0]['name'] == "Phase 0"
    assert data[1]['name'] == "Phase 1"

    logger.info("Get phases test completed successfully")

@pytest.mark.api
@pytest.mark.integration
def test_update_phase(client, test_user, auth_headers, db_session, logger):
    """Test updating a phase"""
    logger.info("Starting update phase test...")
    
    # Create a test property and phase
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="IL",
        zipCode="12345"
    )
    db_session.add(property)
    db_session.commit()

    phase = Phase(
        property_id=property.id,
        name="Original Phase",
        startDate=date.today(),
        expectedEndDate=date.today()
    )
    db_session.add(phase)
    db_session.commit()

    logger.debug(f"Created test phase: {phase.name}")

    update_data = {
        "name": "Updated Phase",
        "startDate": date.today().isoformat()
    }

    response = client.put(f'/api/phases/{phase.id}',
                        json=update_data,
                        headers=auth_headers)
    
    logger.debug(f"Response status: {response.status_code}")
    
    assert response.status_code == 200
    data = response.json
    assert data["name"] == "Updated Phase"

    # Verify update in database
    updated_phase = db_session.query(Phase).get(phase.id)
    assert updated_phase.name == "Updated Phase"

    logger.info("Update phase test completed successfully")

@pytest.mark.integration
def test_create_property(client, auth_headers):
    """Test creating a new property"""
    logger.info('Testing property creation')
    response = client.post('/api/properties', json=TEST_PROPERTY_DATA, headers=auth_headers)
    assert response.status_code == 201
    assert response.json['message'] == 'Property added successfully'
    assert 'id' in response.json

    # Verify property was created
    property_id = response.json['id']
    response = client.get(f'/api/properties/{property_id}', headers=auth_headers)
    assert response.status_code == 200
    for key, value in TEST_PROPERTY_DATA.items():
        if key != 'status_date':  # Skip date comparison
            assert response.json[key] == value
    logger.info('Property creation test passed')

@pytest.mark.integration
def test_get_property(client, auth_headers, test_property):
    """Test retrieving a property"""
    logger.info('Testing property retrieval')
    response = client.get(f'/api/properties/{test_property.id}', headers=auth_headers)
    assert response.status_code == 200
    for key, value in TEST_PROPERTY_DATA.items():
        if key != 'status_date':  # Skip date comparison
            assert response.json[key] == value
    logger.info('Property retrieval test passed')

@pytest.mark.integration
def test_get_properties(client, auth_headers, test_property):
    """Test retrieving all properties"""
    logger.info('Testing properties list retrieval')
    response = client.get('/api/properties', headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json) == 1
    property_data = response.json[0]
    assert property_data['id'] == test_property.id
    assert property_data['propertyName'] == TEST_PROPERTY_DATA['propertyName']
    logger.info('Properties list test passed')

@pytest.mark.integration
def test_update_property(client, auth_headers, test_property):
    """Test updating a property"""
    logger.info('Testing property update')
    update_data = {
        'propertyName': 'Updated Property',
        'purchaseCost': 150000.00,
        'totalRehabCost': 75000.00
    }
    response = client.put(f'/api/properties/{test_property.id}', json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == 'Property updated successfully'

    # Verify changes
    response = client.get(f'/api/properties/{test_property.id}', headers=auth_headers)
    assert response.status_code == 200
    assert response.json['propertyName'] == update_data['propertyName']
    assert response.json['purchaseCost'] == update_data['purchaseCost']
    assert response.json['totalRehabCost'] == update_data['totalRehabCost']
    logger.info('Property update test passed')

@pytest.mark.integration
def test_delete_property(client, auth_headers, test_property):
    """Test deleting a property"""
    logger.info('Testing property deletion')
    response = client.delete(f'/api/properties/{test_property.id}', headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == 'Property deleted successfully'

    # Verify deletion
    response = client.get(f'/api/properties/{test_property.id}', headers=auth_headers)
    assert response.status_code == 404
    logger.info('Property deletion test passed')

@pytest.mark.integration
def test_property_not_found(client, auth_headers):
    """Test accessing non-existent property"""
    logger.info('Testing non-existent property access')
    response = client.get('/api/properties/999999', headers=auth_headers)
    assert response.status_code == 404
    assert response.json['message'] == 'Property not found'
    logger.info('Non-existent property test passed')

@pytest.mark.integration
def test_unauthorized_access(client):
    """Test accessing property routes without authentication"""
    logger.info('Testing unauthorized access')
    endpoints = [
        ('GET', '/api/properties'),
        ('POST', '/api/properties'),
        ('GET', '/api/properties/1'),
        ('PUT', '/api/properties/1'),
        ('DELETE', '/api/properties/1')
    ]
    for method, endpoint in endpoints:
        response = client.open(endpoint, method=method)
        assert response.status_code == 401
    logger.info('Unauthorized access test passed')

@pytest.mark.integration
def test_wrong_user_access(client, auth_headers, test_property):
    """Test accessing property with wrong user"""
    logger.info('Testing wrong user access')
    # Create another user and get their token
    other_user = User(
        email='other@example.com',
        first_name='Other',
        last_name='User'
    )
    other_user.set_password('password123')
    db.session.add(other_user)
    db.session.commit()
    other_token = create_access_token(identity=other_user.email)
    other_headers = {'Authorization': f'Bearer {other_token}'}

    # Try to access the first user's property
    response = client.get(f'/api/properties/{test_property.id}', headers=other_headers)
    assert response.status_code == 404
    assert response.json['message'] == 'Property not found'
    logger.info('Wrong user access test passed') 