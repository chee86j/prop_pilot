import pytest
from datetime import datetime, timedelta
from models import db, Tenant, Property, Lease

@pytest.fixture
def test_tenant(app):
    tenant = Tenant(
        firstName='John',
        lastName='Doe',
        email='john@example.com',
        phoneNumber='1234567890',
        dateOfBirth=datetime.now().date() - timedelta(days=365*25),
        creditScoreAtInitialApplication=700,
        occupation='Software Engineer',
        employerName='Tech Corp'
    )
    db.session.add(tenant)
    db.session.commit()
    yield tenant
    db.session.delete(tenant)
    db.session.commit()

@pytest.fixture
def test_property(app):
    property = Property(
        propertyName='Test Property',
        address='123 Test St',
        city='Test City',
        state='TS',
        zipCode='12345',
        numUnits=1,
        arvSalePrice=200000
    )
    db.session.add(property)
    db.session.commit()
    yield property
    db.session.delete(property)
    db.session.commit()

def test_create_lease_success(client, auth_headers, test_tenant, test_property):
    """Test successful lease creation"""
    data = {
        'tenantId': test_tenant.id,
        'propertyId': test_property.id,
        'startDate': (datetime.now().date() + timedelta(days=1)).isoformat(),
        'endDate': (datetime.now().date() + timedelta(days=365)).isoformat(),
        'rentAmount': 1500.00,
        'typeOfLease': 'Fixed',
        'renewalCondition': 'Option to renew for 1 year'
    }
    
    response = client.post('/api/leases', json=data, headers=auth_headers)
    assert response.status_code == 201
    assert 'id' in response.json
    assert 'startDate' in response.json
    assert 'endDate' in response.json
    assert 'rentAmount' in response.json

def test_create_lease_missing_fields(client, auth_headers):
    """Test lease creation with missing required fields"""
    response = client.post('/api/leases', json={}, headers=auth_headers)
    assert response.status_code == 400
    assert 'missing_fields' in response.json
    assert len(response.json['missing_fields']) > 0

def test_create_lease_invalid_tenant(client, auth_headers, test_property):
    """Test lease creation with invalid tenant ID"""
    data = {
        'tenantId': 9999,
        'propertyId': test_property.id,
        'startDate': (datetime.now().date() + timedelta(days=1)).isoformat(),
        'endDate': (datetime.now().date() + timedelta(days=365)).isoformat(),
        'rentAmount': 1500.00,
        'typeOfLease': 'Fixed'
    }
    
    response = client.post('/api/leases', json=data, headers=auth_headers)
    assert response.status_code == 404
    assert 'Tenant not found' in response.json['error']

def test_create_lease_invalid_property(client, auth_headers, test_tenant):
    """Test lease creation with invalid property ID"""
    data = {
        'tenantId': test_tenant.id,
        'propertyId': 9999,
        'startDate': (datetime.now().date() + timedelta(days=1)).isoformat(),
        'endDate': (datetime.now().date() + timedelta(days=365)).isoformat(),
        'rentAmount': 1500.00,
        'typeOfLease': 'Fixed'
    }
    
    response = client.post('/api/leases', json=data, headers=auth_headers)
    assert response.status_code == 404
    assert 'Property not found' in response.json['error']

def test_create_lease_invalid_dates(client, auth_headers, test_tenant, test_property):
    """Test lease creation with invalid dates"""
    # Test end date before start date
    data = {
        'tenantId': test_tenant.id,
        'propertyId': test_property.id,
        'startDate': (datetime.now().date() + timedelta(days=2)).isoformat(),
        'endDate': (datetime.now().date() + timedelta(days=1)).isoformat(),
        'rentAmount': 1500.00,
        'typeOfLease': 'Fixed'
    }
    
    response = client.post('/api/leases', json=data, headers=auth_headers)
    assert response.status_code == 400
    assert 'End date must be after start date' in response.json['error']

def test_create_lease_invalid_rent(client, auth_headers, test_tenant, test_property):
    """Test lease creation with invalid rent amount"""
    data = {
        'tenantId': test_tenant.id,
        'propertyId': test_property.id,
        'startDate': (datetime.now().date() + timedelta(days=1)).isoformat(),
        'endDate': (datetime.now().date() + timedelta(days=365)).isoformat(),
        'rentAmount': -100.00,
        'typeOfLease': 'Fixed'
    }
    
    response = client.post('/api/leases', json=data, headers=auth_headers)
    assert response.status_code == 400
    assert 'Rent amount must be greater than 0' in response.json['error']

def test_create_lease_invalid_type(client, auth_headers, test_tenant, test_property):
    """Test lease creation with invalid lease type"""
    data = {
        'tenantId': test_tenant.id,
        'propertyId': test_property.id,
        'startDate': (datetime.now().date() + timedelta(days=1)).isoformat(),
        'endDate': (datetime.now().date() + timedelta(days=365)).isoformat(),
        'rentAmount': 1500.00,
        'typeOfLease': 'Invalid Type'
    }
    
    response = client.post('/api/leases', json=data, headers=auth_headers)
    assert response.status_code == 400
    assert 'Invalid lease type' in response.json['error'] 