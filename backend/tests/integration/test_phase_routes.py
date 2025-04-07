import pytest
from datetime import date, datetime
from models import Property, Phase

# Test data for parametrized tests
PHASE_TEST_DATA = [
    {
        "name": "Planning Phase",
        "startDate": date.today().isoformat(),
        "expectedStartDate": date.today().isoformat(),
        "expectedEndDate": date.today().isoformat(),
        "endDate": None
    },
    {
        "name": "Construction Phase",
        "startDate": date.today().isoformat(),
        "expectedStartDate": date.today().isoformat(),
        "expectedEndDate": date.today().isoformat(),
        "endDate": None
    }
]

@pytest.mark.api
@pytest.mark.integration
def test_get_phases(client, test_user, auth_headers, db_session, logger):
    """Test getting all phases for a property"""
    logger.info("📋 Starting get phases test...")
    
    # Create test property
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    db_session.add(property)
    db_session.commit()

    logger.debug(f"🏠 Created test property: {property.propertyName}")

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

    logger.debug(f"📑 Created {len(phases)} test phases")

    # Test getting phases
    response = client.get(f'/api/phases/{property.id}', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    assert data[0]['name'] == "Phase 0"
    assert data[1]['name'] == "Phase 1"

    logger.info("✅ Get phases test completed successfully")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("phase_data", PHASE_TEST_DATA)
def test_add_phase(client, test_user, auth_headers, db_session, phase_data, logger):
    """Test adding a new phase"""
    logger.info(f"🏗️ Starting add phase test for {phase_data['name']}...")
    
    # Create test property
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    db_session.add(property)
    db_session.commit()

    logger.debug(f"🏠 Created test property: {property.propertyName}")

    # Add property_id to phase data
    phase_data['property_id'] = property.id
    
    response = client.post('/api/phases', 
                         json=phase_data,
                         headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 201
    data = response.json
    assert data["name"] == phase_data["name"]
    assert data["startDate"] == phase_data["startDate"]
    assert data["expectedStartDate"] == phase_data["expectedStartDate"]
    assert data["expectedEndDate"] == phase_data["expectedEndDate"]
    assert data["endDate"] is None

    # Verify phase was added to database
    phase = db_session.query(Phase).get(data["id"])
    assert phase is not None
    assert phase.name == phase_data["name"]
    assert phase.startDate.isoformat() == phase_data["startDate"]

    logger.info(f"✅ Add phase test completed for {phase_data['name']}")

@pytest.mark.api
@pytest.mark.integration
def test_update_phase(client, test_user, auth_headers, db_session, logger):
    """Test updating a phase"""
    logger.info("🔄 Starting update phase test...")
    
    # Create test property and phase
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
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

    logger.debug(f"📑 Created test phase: {phase.name}")

    update_data = {
        "name": "Updated Phase",
        "startDate": date.today().isoformat(),
        "expectedEndDate": date.today().isoformat()
    }

    response = client.put(f'/api/phases/{phase.id}',
                        json=update_data,
                        headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    data = response.json
    assert data["name"] == "Updated Phase"
    assert data["startDate"] == update_data["startDate"]
    assert data["expectedEndDate"] == update_data["expectedEndDate"]

    # Verify update in database
    updated_phase = db_session.query(Phase).get(phase.id)
    assert updated_phase.name == "Updated Phase"
    assert updated_phase.startDate.isoformat() == update_data["startDate"]

    logger.info("✅ Update phase test completed successfully")

@pytest.mark.api
@pytest.mark.integration
def test_update_phase_not_found(client, test_user, auth_headers, logger):
    """Test updating a non-existent phase"""
    logger.info("🔄 Starting update non-existent phase test...")
    
    update_data = {
        "name": "Updated Phase",
        "startDate": date.today().isoformat()
    }

    response = client.put('/api/phases/99999',
                        json=update_data,
                        headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 404
    data = response.json
    assert data["message"] == "Phase not found"

    logger.info("✅ Update non-existent phase test completed successfully")

@pytest.mark.api
@pytest.mark.integration
def test_delete_phase(client, test_user, auth_headers, db_session, logger):
    """Test deleting a phase"""
    logger.info("🗑️ Starting delete phase test...")
    
    # Create test property and phase
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    db_session.add(property)
    db_session.commit()

    phase = Phase(
        property_id=property.id,
        name="Test Phase",
        startDate=date.today(),
        expectedEndDate=date.today()
    )
    db_session.add(phase)
    db_session.commit()

    logger.debug(f"📑 Created test phase: {phase.name}")

    response = client.delete(f'/api/phases/{phase.id}', headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    data = response.json
    assert data["message"] == "Phase deleted successfully"

    # Verify phase was deleted from database
    deleted_phase = db_session.query(Phase).get(phase.id)
    assert deleted_phase is None

    logger.info("✅ Delete phase test completed successfully")

@pytest.mark.api
@pytest.mark.integration
def test_delete_phase_not_found(client, test_user, auth_headers, logger):
    """Test deleting a non-existent phase"""
    logger.info("🗑️ Starting delete non-existent phase test...")
    
    response = client.delete('/api/phases/99999', headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 404
    data = response.json
    assert data["message"] == "Phase not found"

    logger.info("✅ Delete non-existent phase test completed successfully") 