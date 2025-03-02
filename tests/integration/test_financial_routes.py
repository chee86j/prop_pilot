import pytest
from datetime import date
from models import ConstructionDraw, Receipt, Property

def test_get_construction_draws(client, test_user, test_property, auth_headers, db_session):
    """Test getting construction draws for a property"""
    # Create test draws
    draws = []
    for i in range(2):
        draw = ConstructionDraw(
            property_id=test_property.id,
            release_date=date.today(),
            amount=50000.00 * (i + 1),
            bank_account_number=f"123{i}",
            is_approved=(i == 1)
        )
        draws.append(draw)
        db_session.add(draw)
    db_session.commit()

    # Test getting draws
    response = client.get(f'/api/construction-draws/{test_property.id}', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    assert data[0]['amount'] == 50000.00
    assert data[1]['amount'] == 100000.00
    assert data[0]['is_approved'] == False
    assert data[1]['is_approved'] == True

def test_add_construction_draw(client, test_user, test_property, auth_headers, db_session):
    """Test adding a new construction draw"""
    draw_data = {
        "property_id": test_property.id,
        "release_date": date.today().isoformat(),
        "amount": 75000.00,
        "bank_account_number": "5678",
        "is_approved": True
    }

    response = client.post('/api/construction-draws',
                         json=draw_data,
                         headers=auth_headers)
    assert response.status_code == 201
    data = response.json
    assert "id" in data
    assert data["message"] == "Construction draw added successfully"

    # Verify draw was added to database
    draw = db_session.query(ConstructionDraw).get(data["id"])
    assert draw is not None
    assert draw.amount == 75000.00
    assert draw.bank_account_number == "5678"
    assert draw.is_approved == True

def test_update_construction_draw(client, test_user, test_property, auth_headers, db_session):
    """Test updating a construction draw"""
    # Create a test draw
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234",
        is_approved=False
    )
    db_session.add(draw)
    db_session.commit()

    update_data = {
        "amount": 60000.00,
        "is_approved": True
    }

    response = client.put(f'/api/construction-draws/{draw.id}',
                        json=update_data,
                        headers=auth_headers)
    assert response.status_code == 200
    assert response.json["message"] == "Construction draw updated successfully"

    # Verify update in database
    updated_draw = db_session.query(ConstructionDraw).get(draw.id)
    assert updated_draw.amount == 60000.00
    assert updated_draw.is_approved == True

def test_delete_construction_draw(client, test_user, test_property, auth_headers, db_session):
    """Test deleting a construction draw"""
    # Create a test draw
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234"
    )
    db_session.add(draw)
    db_session.commit()

    response = client.delete(f'/api/construction-draws/{draw.id}',
                           headers=auth_headers)
    assert response.status_code == 200
    assert response.json["message"] == "Construction draw deleted successfully"

    # Verify deletion
    deleted_draw = db_session.query(ConstructionDraw).get(draw.id)
    assert deleted_draw is None

def test_get_receipts(client, test_user, test_property, auth_headers, db_session):
    """Test getting receipts for a property"""
    # Create test receipts
    receipts = []
    for i in range(2):
        receipt = Receipt(
            property_id=test_property.id,
            date=date.today(),
            amount=1000.00 * (i + 1),
            vendor=f"Vendor {i}",
            description=f"Test receipt {i}"
        )
        receipts.append(receipt)
        db_session.add(receipt)
    db_session.commit()

    # Test getting receipts
    response = client.get(f'/api/receipts/{test_property.id}', headers=auth_headers)
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    assert data[0]['amount'] == 1000.00
    assert data[1]['amount'] == 2000.00
    assert data[0]['vendor'] == "Vendor 0"
    assert data[1]['vendor'] == "Vendor 1"

def test_add_receipt(client, test_user, test_property, auth_headers, db_session):
    """Test adding a new receipt"""
    receipt_data = {
        "property_id": test_property.id,
        "date": date.today().isoformat(),
        "amount": 1500.00,
        "vendor": "Test Vendor",
        "description": "Test receipt"
    }

    response = client.post('/api/receipts',
                         json=receipt_data,
                         headers=auth_headers)
    assert response.status_code == 201
    data = response.json
    assert "id" in data
    assert data["message"] == "Receipt added successfully"

    # Verify receipt was added to database
    receipt = db_session.query(Receipt).get(data["id"])
    assert receipt is not None
    assert receipt.amount == 1500.00
    assert receipt.vendor == "Test Vendor"
    assert receipt.description == "Test receipt" 