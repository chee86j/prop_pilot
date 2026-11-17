import pytest
from datetime import date, timedelta
from models import PropertyMaintenanceRequest, Property, User
from flask import url_for
from flask_jwt_extended import create_access_token
from models import Tenant
from uuid import uuid4


@pytest.fixture
def test_property(db_session, test_user):
    """Create a property with the current model's required ownership fields."""
    property = Property(
        owner_id=test_user.id,
        address='123 Test St',
        purchase_price=100000,
        propertyName='Test Property',
        city='Test City',
        state='TS',
        zipCode='12345',
    )
    db_session.add(property)
    db_session.commit()
    return property


@pytest.fixture
def maintenance_owners(db_session, test_user, test_property, test_tenant):
    other = User(first_name='Other', last_name='Owner', email=f'{uuid4()}@example.com')
    db_session.add(other)
    db_session.flush()
    other_property = Property(owner_id=other.id, address='456 Other St', purchase_price=200000)
    other_tenant = Tenant(
        firstName='Other', lastName='Tenant', email=f'{uuid4()}@example.com',
        dateOfBirth=date(1990, 1, 1), manager_id=other.id,
    )
    db_session.add_all([other_property, other_tenant])
    db_session.flush()
    owned_request = PropertyMaintenanceRequest(
        propertyId=test_property.id, tenantId=test_tenant.id, description='Owner request'
    )
    other_request = PropertyMaintenanceRequest(
        propertyId=other_property.id, tenantId=other_tenant.id, description='Other request'
    )
    db_session.add_all([owned_request, other_request])
    db_session.commit()
    return {
        'property_id': test_property.id,
        'tenant_id': test_tenant.id,
        'request_id': owned_request.id,
        'other_property_id': other_property.id,
        'other_tenant_id': other_tenant.id,
        'other_request_id': other_request.id,
        'other_headers': {'Authorization': f'Bearer {create_access_token(identity=other.email)}'},
    }

# Test data
MAINTENANCE_DATA = {
    'propertyId': None,  # Will be set in tests
    'tenantId': None,    # Will be set in tests
    'description': 'Kitchen sink faucet is leaking',
    'status': 'pending',
    'timeToCompletion': 24
}

@pytest.mark.integration
def test_create_maintenance_request(client, auth_headers, test_property, test_tenant, logger):
    """Test creating a maintenance request"""
    logger.info('🔧 Starting create maintenance request test...')
    
    request_data = {
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'description': 'Test maintenance request',
        'status': 'pending',
        'timeToCompletion': 24
    }
    
    response = client.post('/api/property-maintenance-requests',
                         json=request_data,
                         headers=auth_headers)
    
    assert response.status_code == 201
    assert 'id' in response.json

@pytest.mark.integration
def test_get_maintenance_request(client, auth_headers, test_property, test_tenant, logger):
    """Test retrieving a maintenance request"""
    logger.info('🔧 Starting get maintenance request test...')
    
    # Create a maintenance request first
    request_data = {
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'description': 'Test maintenance request',
        'status': 'pending',
        'timeToCompletion': 24
    }
    
    create_response = client.post('/api/property-maintenance-requests',
                               json=request_data,
                               headers=auth_headers)
    request_id = create_response.json['id']
    
    # Get the maintenance request
    response = client.get(f'/api/property-maintenance-requests/{request_id}',
                        headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['description'] == request_data['description']
    assert response.json['status'] == request_data['status']

@pytest.mark.integration
def test_update_maintenance_request(client, auth_headers, test_property, test_tenant, logger):
    """Test updating a maintenance request"""
    logger.info('🔧 Starting update maintenance request test...')
    
    # Create a maintenance request first
    request_data = {
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'description': 'Test maintenance request',
        'status': 'pending',
        'timeToCompletion': 24
    }
    
    create_response = client.post('/api/property-maintenance-requests',
                               json=request_data,
                               headers=auth_headers)
    request_id = create_response.json['id']
    
    # Update the request
    update_data = {
        'status': 'in_progress',
        'timeToCompletion': 48
    }
    
    response = client.put(f'/api/property-maintenance-requests/{request_id}',
                        json=update_data,
                        headers=auth_headers)
    
    assert response.status_code == 200
    
    # Verify the update
    get_response = client.get(f'/api/property-maintenance-requests/{request_id}',
                           headers=auth_headers)
    assert get_response.json['status'] == update_data['status']
    assert get_response.json['timeToCompletion'] == update_data['timeToCompletion']

@pytest.mark.integration
def test_delete_maintenance_request(client, auth_headers, test_property, test_tenant, logger):
    """Test deleting a maintenance request"""
    logger.info('🔧 Starting delete maintenance request test...')
    
    # Create a maintenance request first
    request_data = {
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'description': 'Test maintenance request',
        'status': 'pending',
        'timeToCompletion': 24
    }
    
    create_response = client.post('/api/property-maintenance-requests',
                               json=request_data,
                               headers=auth_headers)
    request_id = create_response.json['id']
    
    # Delete the request
    response = client.delete(f'/api/property-maintenance-requests/{request_id}',
                          headers=auth_headers)
    
    assert response.status_code == 200
    
    # Verify deletion
    get_response = client.get(f'/api/property-maintenance-requests/{request_id}',
                           headers=auth_headers)
    assert get_response.status_code == 404

@pytest.mark.integration
def test_list_maintenance_requests(client, auth_headers, test_property, test_tenant, logger):
    """Test listing all maintenance requests"""
    logger.info('🔧 Starting list maintenance requests test...')
    
    # Create a couple of maintenance requests
    request_data = {
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'description': 'Test maintenance request',
        'status': 'pending',
        'timeToCompletion': 24
    }
    
    client.post('/api/property-maintenance-requests',
               json=request_data,
               headers=auth_headers)
    
    request_data['description'] = 'Another test request'
    client.post('/api/property-maintenance-requests',
               json=request_data,
               headers=auth_headers)
    
    # Get all requests
    response = client.get('/api/property-maintenance-requests',
                        headers=auth_headers)
    
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) >= 2

@pytest.mark.integration
def test_basic_validation(client, test_user, auth_headers, test_property, logger):
    """Test basic validation of maintenance request data"""
    logger.info("🔧 Starting basic validation test...")

    # Test missing required fields
    invalid_data = {
        'description': 'Fix Something'  # Missing other required fields
    }
    response = client.post('/api/property-maintenance-requests', 
                         json=invalid_data,
                         headers=auth_headers)
    assert response.status_code == 400

    logger.info("✅ Basic validation test completed")

@pytest.mark.integration
def test_detailed_validation(client, test_property, test_tenant, auth_headers, logger):
    """Test detailed validation of maintenance request data"""
    logger.info("🔧 Starting detailed validation test...")
    
    # Test missing required fields
    invalid_data = {
        'description': 'Fix Something'  # Missing other required fields
    }
    response = client.post('/api/property-maintenance-requests', 
                         json=invalid_data,
                         headers=auth_headers)
    assert response.status_code == 400
    
    # Test invalid status
    invalid_data = {
        **MAINTENANCE_DATA,
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'status': 'Invalid'
    }
    response = client.post('/api/property-maintenance-requests', 
                         json=invalid_data,
                         headers=auth_headers)
    assert response.status_code == 400
    
    # Test invalid timeToCompletion
    invalid_data = {
        **MAINTENANCE_DATA,
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'timeToCompletion': -1
    }
    response = client.post('/api/property-maintenance-requests', 
                         json=invalid_data,
                         headers=auth_headers)
    assert response.status_code == 400
    
    logger.info("✅ Detailed validation test completed")


@pytest.mark.integration
def test_maintenance_list_is_scoped_to_property_owner(client, auth_headers, maintenance_owners):
    records = maintenance_owners
    path = '/api/property-maintenance-requests'

    response = client.get(path, headers=auth_headers)
    assert response.status_code == 200
    assert [item['id'] for item in response.json] == [records['request_id']]

    response = client.get(path, query_string={'property_id': records['property_id']}, headers=auth_headers)
    assert response.status_code == 200
    assert [item['id'] for item in response.json] == [records['request_id']]

    response = client.get(path, query_string={'property_id': records['other_property_id']}, headers=auth_headers)
    assert response.status_code == 404
    missing = client.get(path, query_string={'property_id': 2147483647}, headers=auth_headers)
    assert missing.status_code == 404
    assert response.json == missing.json

    response = client.get(path, headers=records['other_headers'])
    assert response.status_code == 200
    assert [item['id'] for item in response.json] == [records['other_request_id']]


@pytest.mark.integration
@pytest.mark.parametrize('method', ['get', 'put', 'delete'])
def test_other_owners_maintenance_request_is_inaccessible(client, auth_headers, maintenance_owners, method):
    request_id = maintenance_owners['other_request_id']
    kwargs = {'headers': auth_headers}
    if method == 'put':
        kwargs['json'] = {'description': 'Unauthorized change'}
    response = getattr(client, method)(f'/api/property-maintenance-requests/{request_id}', **kwargs)
    missing = getattr(client, method)('/api/property-maintenance-requests/2147483647', **kwargs)
    assert response.status_code == 404
    assert response.json == missing.json

    owner_response = client.get(
        f'/api/property-maintenance-requests/{request_id}',
        headers=maintenance_owners['other_headers'],
    )
    assert owner_response.status_code == 200
    assert owner_response.json['description'] == 'Other request'


@pytest.mark.integration
@pytest.mark.parametrize('foreign_field', ['propertyId', 'tenantId'])
def test_create_rejects_other_owners_property_or_tenant(client, auth_headers, maintenance_owners, foreign_field):
    records = maintenance_owners
    data = {
        'propertyId': records['property_id'],
        'tenantId': records['tenant_id'],
        'description': 'Test repair',
    }
    data[foreign_field] = records['other_property_id' if foreign_field == 'propertyId' else 'other_tenant_id']
    response = client.post('/api/property-maintenance-requests', json=data, headers=auth_headers)
    assert response.status_code == 404
    assert client.get('/api/property-maintenance-requests', headers=auth_headers).json == [
        client.get(f"/api/property-maintenance-requests/{records['request_id']}", headers=auth_headers).json
    ]


@pytest.mark.integration
@pytest.mark.parametrize('field,expected_status', [
    ('propertyId', 404), ('tenantId', 404), ('id', 400),
])
def test_update_rejects_ownership_bypasses_without_partial_changes(
    client, auth_headers, maintenance_owners, field, expected_status
):
    records = maintenance_owners
    values = {
        'propertyId': records['other_property_id'],
        'tenantId': records['other_tenant_id'],
        'id': records['other_request_id'],
    }
    path = f"/api/property-maintenance-requests/{records['request_id']}"
    response = client.put(path, json={'description': 'Should not save', field: values[field]}, headers=auth_headers)
    assert response.status_code == expected_status
    record = client.get(path, headers=auth_headers).json
    assert record['description'] == 'Owner request'
    assert record['propertyId'] == records['property_id']
    assert record['tenantId'] == records['tenant_id']


@pytest.mark.integration
@pytest.mark.parametrize('method,path', [
    ('get', '/api/property-maintenance-requests'),
    ('post', '/api/property-maintenance-requests'),
    ('get', '/api/property-maintenance-requests/1'),
    ('put', '/api/property-maintenance-requests/1'),
    ('delete', '/api/property-maintenance-requests/1'),
])
def test_maintenance_routes_require_authentication(client, method, path):
    assert getattr(client, method)(path).status_code == 401
