import pytest
from datetime import date, timedelta
from models import PropertyMaintenanceRequest, Property, User
from flask import url_for

# Test data
MAINTENANCE_DATA = {
    'title': 'Fix Leaky Faucet',
    'description': 'Kitchen sink faucet is leaking',
    'priority': 'High',
    'status': 'Open',
    'estimatedCost': 150.00,
    'actualCost': None,
    'scheduledDate': date.today().isoformat(),
    'completionDate': None
}

@pytest.mark.integration
def test_create_maintenance_request(client, db_session, test_property, logger):
    """Test creating a new maintenance request"""
    logger.info("🔧 Starting create maintenance request test...")
    
    request_data = {**MAINTENANCE_DATA, 'propertyId': test_property.id}
    response = client.post('/api/maintenance', json=request_data)
    assert response.status_code == 201
    
    # Verify request was created
    maintenance_request = db_session.query(PropertyMaintenanceRequest).first()
    assert maintenance_request is not None
    assert maintenance_request.title == MAINTENANCE_DATA['title']
    assert maintenance_request.property_id == test_property.id
    
    logger.info("✅ Create maintenance request test completed")

@pytest.mark.integration
def test_get_maintenance_request(client, db_session, test_property, logger):
    """Test retrieving a maintenance request"""
    logger.info("🔧 Starting get maintenance request test...")
    
    # Create request first
    request = PropertyMaintenanceRequest(
        property_id=test_property.id,
        title=MAINTENANCE_DATA['title'],
        description=MAINTENANCE_DATA['description'],
        priority=MAINTENANCE_DATA['priority'],
        status=MAINTENANCE_DATA['status'],
        estimatedCost=MAINTENANCE_DATA['estimatedCost'],
        scheduledDate=date.today()
    )
    db_session.add(request)
    db_session.commit()
    
    response = client.get(f'/api/maintenance/{request.id}')
    assert response.status_code == 200
    data = response.json
    assert data['title'] == MAINTENANCE_DATA['title']
    
    logger.info("✅ Get maintenance request test completed")

@pytest.mark.integration
def test_update_maintenance_request(client, db_session, test_property, logger):
    """Test updating a maintenance request"""
    logger.info("🔧 Starting update maintenance request test...")
    
    # Create request first
    request = PropertyMaintenanceRequest(
        property_id=test_property.id,
        title=MAINTENANCE_DATA['title'],
        description=MAINTENANCE_DATA['description'],
        priority=MAINTENANCE_DATA['priority'],
        status='Open',
        estimatedCost=MAINTENANCE_DATA['estimatedCost'],
        scheduledDate=date.today()
    )
    db_session.add(request)
    db_session.commit()
    
    update_data = {
        'status': 'Completed',
        'actualCost': 175.00,
        'completionDate': date.today().isoformat()
    }
    
    response = client.put(f'/api/maintenance/{request.id}', json=update_data)
    assert response.status_code == 200
    
    # Verify changes
    updated_request = db_session.query(PropertyMaintenanceRequest).get(request.id)
    assert updated_request.status == update_data['status']
    assert updated_request.actualCost == update_data['actualCost']
    
    logger.info("✅ Update maintenance request test completed")

@pytest.mark.integration
def test_delete_maintenance_request(client, db_session, test_property, logger):
    """Test deleting a maintenance request"""
    logger.info("🔧 Starting delete maintenance request test...")
    
    # Create request first
    request = PropertyMaintenanceRequest(
        property_id=test_property.id,
        title=MAINTENANCE_DATA['title'],
        description=MAINTENANCE_DATA['description'],
        priority=MAINTENANCE_DATA['priority'],
        status=MAINTENANCE_DATA['status'],
        estimatedCost=MAINTENANCE_DATA['estimatedCost'],
        scheduledDate=date.today()
    )
    db_session.add(request)
    db_session.commit()
    
    response = client.delete(f'/api/maintenance/{request.id}')
    assert response.status_code == 200
    
    # Verify deletion
    deleted_request = db_session.query(PropertyMaintenanceRequest).get(request.id)
    assert deleted_request is None
    
    logger.info("✅ Delete maintenance request test completed")

@pytest.mark.integration
def test_list_maintenance_requests(client, db_session, test_property, logger):
    """Test listing maintenance requests"""
    logger.info("🔧 Starting list maintenance requests test...")
    
    # Create multiple requests
    requests = [
        PropertyMaintenanceRequest(
            property_id=test_property.id,
            title='Fix Roof',
            description='Roof is leaking',
            priority='High',
            status='Open',
            estimatedCost=500.00,
            scheduledDate=date.today()
        ),
        PropertyMaintenanceRequest(
            property_id=test_property.id,
            title='Paint Walls',
            description='Interior walls need painting',
            priority='Low',
            status='Open',
            estimatedCost=300.00,
            scheduledDate=date.today() + timedelta(days=7)
        )
    ]
    for request in requests:
        db_session.add(request)
    db_session.commit()
    
    # Test listing all requests
    response = client.get('/api/maintenance')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    
    # Test filtering by property
    response = client.get(f'/api/maintenance?propertyId={test_property.id}')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    
    # Test filtering by status
    response = client.get('/api/maintenance?status=Open')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    
    logger.info("✅ List maintenance requests test completed")

@pytest.mark.integration
def test_maintenance_request_not_found(client, logger):
    """Test handling of non-existent maintenance request"""
    logger.info("🔧 Starting maintenance request not found test...")
    
    response = client.get('/api/maintenance/999')
    assert response.status_code == 404
    
    logger.info("✅ Maintenance request not found test completed")

@pytest.mark.integration
def test_invalid_maintenance_data(client, test_property, logger):
    """Test validation of maintenance request data"""
    logger.info("🔧 Starting invalid maintenance data test...")
    
    # Test missing required fields
    invalid_data = {
        'title': 'Fix Something'  # Missing other required fields
    }
    response = client.post('/api/maintenance', json=invalid_data)
    assert response.status_code == 400
    
    # Test invalid priority
    invalid_data = {**MAINTENANCE_DATA, 'propertyId': test_property.id, 'priority': 'Invalid'}
    response = client.post('/api/maintenance', json=invalid_data)
    assert response.status_code == 400
    
    # Test invalid status
    invalid_data = {**MAINTENANCE_DATA, 'propertyId': test_property.id, 'status': 'Invalid'}
    response = client.post('/api/maintenance', json=invalid_data)
    assert response.status_code == 400
    
    # Test invalid dates
    invalid_data = {**MAINTENANCE_DATA, 'propertyId': test_property.id, 'scheduledDate': 'invalid-date'}
    response = client.post('/api/maintenance', json=invalid_data)
    assert response.status_code == 400
    
    logger.info("✅ Invalid maintenance data test completed") 