import pytest
from datetime import date, timedelta
from models import Tenant, Lease, Property, User
from flask import url_for
from tests.conftest import TENANT_DATA

@pytest.mark.integration
def test_create_tenant(client, auth_headers, test_user, logger):
    """Test creating a new tenant"""
    logger.info('👥 Starting create tenant test...')
    
    # Add manager_id to the tenant data
    tenant_data = TENANT_DATA.copy()
    tenant_data['manager_id'] = test_user.id
    
    response = client.post('/api/tenants',
                         json=tenant_data,
                         headers=auth_headers)
    
    assert response.status_code == 201
    assert 'id' in response.json

@pytest.mark.integration
def test_get_tenant(client, auth_headers, test_tenant, logger):
    """Test retrieving a tenant"""
    logger.info('👥 Starting get tenant test...')
    
    response = client.get(f'/api/tenants/{test_tenant.id}',
                        headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['firstName'] == TENANT_DATA['firstName']
    assert response.json['lastName'] == TENANT_DATA['lastName']

@pytest.mark.integration
def test_update_tenant(client, auth_headers, test_tenant, logger):
    """Test updating a tenant"""
    logger.info('👥 Starting update tenant test...')
    
    update_data = {
        'occupation': 'Senior Engineer',
        'creditScoreAtInitialApplication': 800
    }
    
    response = client.put(f'/api/tenants/{test_tenant.id}',
                        json=update_data,
                        headers=auth_headers)
    
    assert response.status_code == 200
    
    # Verify the update
    get_response = client.get(f'/api/tenants/{test_tenant.id}',
                           headers=auth_headers)
    assert get_response.json['occupation'] == update_data['occupation']
    assert get_response.json['creditScoreAtInitialApplication'] == update_data['creditScoreAtInitialApplication']

@pytest.mark.integration
def test_delete_tenant(client, auth_headers, test_tenant, logger):
    """Test deleting a tenant"""
    logger.info('👥 Starting delete tenant test...')
    
    response = client.delete(f'/api/tenants/{test_tenant.id}',
                          headers=auth_headers)
    
    assert response.status_code == 200
    
    # Verify deletion
    get_response = client.get(f'/api/tenants/{test_tenant.id}',
                           headers=auth_headers)
    assert get_response.status_code == 404

@pytest.mark.integration
def test_list_tenants(client, auth_headers, test_tenant, logger):
    """Test listing all tenants"""
    logger.info('👥 Starting list tenants test...')
    
    response = client.get('/api/tenants',
                        headers=auth_headers)
    
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0
    assert response.json[0]['firstName'] == TENANT_DATA['firstName']

@pytest.mark.integration
def test_tenant_not_found(client, auth_headers, logger):
    """Test handling of non-existent tenant"""
    logger.info('👥 Starting tenant not found test...')
    
    response = client.get('/api/tenants/999',
                        headers=auth_headers)
    
    assert response.status_code == 404

@pytest.mark.integration
def test_invalid_tenant_data(client, auth_headers, logger):
    """Test validation of tenant data"""
    logger.info('👥 Starting invalid tenant data test...')
    
    # Test missing required fields
    invalid_data = {
        'firstName': 'John'  # Missing other required fields
    }
    
    response = client.post('/api/tenants',
                         json=invalid_data,
                         headers=auth_headers)
    
    assert response.status_code == 400

@pytest.mark.integration
def test_tenant_lease_association(client, auth_headers, test_tenant, test_property, logger):
    """Test associating a lease with a tenant"""
    logger.info('🔗 Starting tenant-lease association test...')
    
    lease_data = {
        'propertyId': test_property.id,
        'tenantId': test_tenant.id,
        'startDate': date.today().isoformat(),
        'endDate': (date.today() + timedelta(days=365)).isoformat(),
        'rentAmount': 1500,
        'typeOfLease': 'Fixed'
    }
    
    response = client.post(f'/api/tenants/{test_tenant.id}/leases',
                         json=lease_data,
                         headers=auth_headers)
    
    assert response.status_code == 201 