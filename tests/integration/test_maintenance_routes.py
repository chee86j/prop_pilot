import pytest
from datetime import date, timedelta
from models import PropertyMaintenanceRequest, Property, User
from flask import url_for

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