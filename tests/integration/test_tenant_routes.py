import pytest
from datetime import date, timedelta
from models import Tenant, Lease, Property, User
from flask import url_for

# Test data
TENANT_DATA = {
    'firstName': 'John',
    'lastName': 'Doe',
    'email': 'john.doe@example.com',
    'dateOfBirth': '1990-01-01',
    'phoneNumber': '123-456-7890',
    'occupation': 'Software Engineer',
    'creditScoreAtInitialApplication': 750
}

@pytest.mark.integration
def test_create_tenant(client, db_session, logger):
    """Test creating a new tenant"""
    logger.info("👥 Starting create tenant test...")
    
    response = client.post('/api/tenants', json=TENANT_DATA)
    assert response.status_code == 201
    
    # Verify tenant was created in database
    tenant = db_session.query(Tenant).filter_by(email=TENANT_DATA['email']).first()
    assert tenant is not None
    assert tenant.firstName == TENANT_DATA['firstName']
    assert tenant.lastName == TENANT_DATA['lastName']
    
    logger.info("✅ Create tenant test completed")

@pytest.mark.integration
def test_get_tenant(client, db_session, logger):
    """Test retrieving a tenant"""
    logger.info("👥 Starting get tenant test...")
    
    # Create tenant first
    tenant = Tenant(
        firstName=TENANT_DATA['firstName'],
        lastName=TENANT_DATA['lastName'],
        email=TENANT_DATA['email'],
        dateOfBirth=date(1990, 1, 1),
        phoneNumber=TENANT_DATA['phoneNumber'],
        occupation=TENANT_DATA['occupation'],
        creditScoreAtInitialApplication=TENANT_DATA['creditScoreAtInitialApplication']
    )
    db_session.add(tenant)
    db_session.commit()
    
    response = client.get(f'/api/tenants/{tenant.id}')
    assert response.status_code == 200
    data = response.json
    assert data['email'] == TENANT_DATA['email']
    
    logger.info("✅ Get tenant test completed")

@pytest.mark.integration
def test_update_tenant(client, db_session, logger):
    """Test updating a tenant"""
    logger.info("👥 Starting update tenant test...")
    
    # Create tenant first
    tenant = Tenant(
        firstName=TENANT_DATA['firstName'],
        lastName=TENANT_DATA['lastName'],
        email=TENANT_DATA['email'],
        dateOfBirth=date(1990, 1, 1),
        phoneNumber=TENANT_DATA['phoneNumber']
    )
    db_session.add(tenant)
    db_session.commit()
    
    update_data = {
        'occupation': 'Senior Engineer',
        'creditScoreAtInitialApplication': 800
    }
    
    response = client.put(f'/api/tenants/{tenant.id}', json=update_data)
    assert response.status_code == 200
    
    # Verify changes in database
    updated_tenant = db_session.query(Tenant).get(tenant.id)
    assert updated_tenant.occupation == update_data['occupation']
    assert updated_tenant.creditScoreAtInitialApplication == update_data['creditScoreAtInitialApplication']
    
    logger.info("✅ Update tenant test completed")

@pytest.mark.integration
def test_delete_tenant(client, db_session, logger):
    """Test deleting a tenant"""
    logger.info("👥 Starting delete tenant test...")
    
    # Create tenant first
    tenant = Tenant(
        firstName=TENANT_DATA['firstName'],
        lastName=TENANT_DATA['lastName'],
        email=TENANT_DATA['email'],
        dateOfBirth=date(1990, 1, 1),
        phoneNumber=TENANT_DATA['phoneNumber']
    )
    db_session.add(tenant)
    db_session.commit()
    
    response = client.delete(f'/api/tenants/{tenant.id}')
    assert response.status_code == 200
    
    # Verify tenant was deleted
    deleted_tenant = db_session.query(Tenant).get(tenant.id)
    assert deleted_tenant is None
    
    logger.info("✅ Delete tenant test completed")

@pytest.mark.integration
def test_list_tenants(client, db_session, logger):
    """Test listing all tenants"""
    logger.info("👥 Starting list tenants test...")
    
    # Create multiple tenants
    tenants = [
        Tenant(
            firstName='John',
            lastName='Doe',
            email='john@example.com',
            dateOfBirth=date(1990, 1, 1),
            phoneNumber='123-456-7890'
        ),
        Tenant(
            firstName='Jane',
            lastName='Smith',
            email='jane@example.com',
            dateOfBirth=date(1992, 2, 2),
            phoneNumber='987-654-3210'
        )
    ]
    for tenant in tenants:
        db_session.add(tenant)
    db_session.commit()
    
    response = client.get('/api/tenants')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    
    logger.info("✅ List tenants test completed")

@pytest.mark.integration
def test_tenant_not_found(client, logger):
    """Test handling of non-existent tenant"""
    logger.info("👥 Starting tenant not found test...")
    
    response = client.get('/api/tenants/999')
    assert response.status_code == 404
    
    logger.info("✅ Tenant not found test completed")

@pytest.mark.integration
def test_invalid_tenant_data(client, logger):
    """Test validation of tenant data"""
    logger.info("👥 Starting invalid tenant data test...")
    
    # Test missing required fields
    invalid_data = {
        'firstName': 'John'  # Missing other required fields
    }
    response = client.post('/api/tenants', json=invalid_data)
    assert response.status_code == 400
    
    # Test invalid email format
    invalid_data = TENANT_DATA.copy()
    invalid_data['email'] = 'invalid-email'
    response = client.post('/api/tenants', json=invalid_data)
    assert response.status_code == 400
    
    # Test invalid date format
    invalid_data = TENANT_DATA.copy()
    invalid_data['dateOfBirth'] = 'invalid-date'
    response = client.post('/api/tenants', json=invalid_data)
    assert response.status_code == 400
    
    logger.info("✅ Invalid tenant data test completed")

@pytest.mark.integration
def test_tenant_lease_association(client, db_session, logger):
    """Test associating a lease with a tenant"""
    logger.info("🔗 Starting tenant-lease association test...")
    
    # Create tenant
    tenant = Tenant(
        firstName=TENANT_DATA['firstName'],
        lastName=TENANT_DATA['lastName'],
        email=TENANT_DATA['email'],
        dateOfBirth=date(1990, 1, 1),
        phoneNumber=TENANT_DATA['phoneNumber']
    )
    db_session.add(tenant)
    
    # Create property
    property = Property(
        propertyName='Test Property',
        address='123 Test St',
        city='Test City',
        state='TS',
        zipCode='12345'
    )
    db_session.add(property)
    db_session.commit()
    
    # Create lease
    lease_data = {
        'propertyId': property.id,
        'startDate': date.today().isoformat(),
        'endDate': (date.today() + timedelta(days=365)).isoformat(),
        'rentAmount': 1500,
        'typeOfLease': 'Fixed'
    }
    
    response = client.post(f'/api/tenants/{tenant.id}/leases', json=lease_data)
    assert response.status_code == 201
    
    # Verify lease was created and associated
    tenant_leases = db_session.query(Lease).filter_by(tenantId=tenant.id).all()
    assert len(tenant_leases) == 1
    assert tenant_leases[0].rentAmount == lease_data['rentAmount']
    
    logger.info("✅ Tenant-lease association test completed") 