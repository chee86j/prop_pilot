import pytest
from datetime import date
from models import Property, Phase

def test_get_properties(client, test_user, auth_headers):
    """Test getting all properties for a user"""
    # Create test properties
    properties = []
    for i in range(3):
        property = Property(
            user_id=test_user.id,
            propertyName=f"Test Property {i}",
            address=f"123 Test St #{i}",
            city="Test City",
            state="TS",
            zipCode="12345",
            purchaseCost=100000,
            totalRehabCost=50000,
            arvSalePrice=200000
        )
        properties.append(property)
        client.db.session.add(property)
    client.db.session.commit()

    # Test getting properties
    response = client.get('/api/properties', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert len(data) == 3
    assert data[0]['propertyName'] == "Test Property 0"
    assert data[0]['address'] == "123 Test St #0"

def test_add_property(client, test_user, auth_headers):
    """Test adding a new property"""
    property_data = {
        "propertyName": "New Test Property",
        "address": "456 Test Ave",
        "city": "Test City",
        "state": "TS",
        "zipCode": "12345",
        "purchaseCost": 150000,
        "totalRehabCost": 75000,
        "arvSalePrice": 300000
    }

    response = client.post('/api/properties', 
                         json=property_data,
                         headers=auth_headers)
    assert response.status_code == 201
    data = response.json
    assert "id" in data
    assert data["message"] == "Property added successfully"

    # Verify property was added to database
    property = Property.query.get(data["id"])
    assert property is not None
    assert property.propertyName == "New Test Property"
    assert property.address == "456 Test Ave"

def test_get_phases(client, test_user, auth_headers):
    """Test getting phases for a property"""
    # Create a test property
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    client.db.session.add(property)
    client.db.session.commit()

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
        client.db.session.add(phase)
    client.db.session.commit()

    # Test getting phases
    response = client.get(f'/api/phases/{property.id}', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    assert data[0]['name'] == "Phase 0"
    assert data[1]['name'] == "Phase 1"

def test_add_phase(client, test_user, auth_headers):
    """Test adding a new phase"""
    # Create a test property
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    client.db.session.add(property)
    client.db.session.commit()

    phase_data = {
        "property_id": property.id,
        "name": "New Phase",
        "startDate": date.today().isoformat(),
        "expectedEndDate": date.today().isoformat()
    }

    response = client.post('/api/phases',
                         json=phase_data,
                         headers=auth_headers)
    assert response.status_code == 201
    data = response.json
    assert data["name"] == "New Phase"
    assert data["property_id"] == property.id

def test_update_phase(client, test_user, auth_headers):
    """Test updating a phase"""
    # Create a test property and phase
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345"
    )
    client.db.session.add(property)
    client.db.session.commit()

    phase = Phase(
        property_id=property.id,
        name="Original Phase",
        startDate=date.today(),
        expectedEndDate=date.today()
    )
    client.db.session.add(phase)
    client.db.session.commit()

    update_data = {
        "name": "Updated Phase",
        "startDate": date.today().isoformat()
    }

    response = client.put(f'/api/phases/{phase.id}',
                        json=update_data,
                        headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert data["name"] == "Updated Phase"

    # Verify update in database
    updated_phase = Phase.query.get(phase.id)
    assert updated_phase.name == "Updated Phase" 