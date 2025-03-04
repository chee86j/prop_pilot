import pytest
from datetime import date
from models import ConstructionDraw, Receipt, Property

# Test data for parametrized tests
CONSTRUCTION_DRAW_TEST_DATA = [
    {
        'amount': 50000.00,
        'bank_account_number': '1234',
        'is_approved': False,
        'description': 'initial foundation draw'
    },
    {
        'amount': 75000.00,
        'bank_account_number': '5678',
        'is_approved': True,
        'description': 'framing phase draw'
    },
    {
        'amount': 100000.00,
        'bank_account_number': '9012',
        'is_approved': True,
        'description': 'finishing phase draw'
    }
]

RECEIPT_TEST_DATA = [
    {
        'amount': 1500.00,
        'vendor': 'Home Depot',
        'description': 'Building materials',
    },
    {
        'amount': 2500.00,
        'vendor': 'Lowes',
        'description': 'Electrical supplies',
    },
    {
        'amount': 3500.00,
        'vendor': 'Local Lumber Co',
        'description': 'Lumber and wood materials',
    }
]

@pytest.mark.api
@pytest.mark.integration
def test_get_construction_draws(client, test_user, test_property, auth_headers, db_session, logger):
    """Test getting construction draws for a property"""
    logger.info("💰 Starting get construction draws test...")
    
    # Create test draws
    draws = []
    for i, draw_data in enumerate(CONSTRUCTION_DRAW_TEST_DATA):
        draw = ConstructionDraw(
            property_id=test_property.id,
            release_date=date.today(),
            amount=draw_data['amount'],
            bank_account_number=draw_data['bank_account_number'],
            is_approved=draw_data['is_approved']
        )
        draws.append(draw)
        db_session.add(draw)
    db_session.commit()

    logger.debug(f"📊 Created {len(draws)} test draws")

    # Test getting draws
    response = client.get(f'/api/construction-draws/{test_property.id}', headers=auth_headers)
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    data = response.json
    assert len(data) == len(CONSTRUCTION_DRAW_TEST_DATA)
    
    for i, draw_data in enumerate(data):
        assert draw_data['amount'] == CONSTRUCTION_DRAW_TEST_DATA[i]['amount']
        assert draw_data['is_approved'] == CONSTRUCTION_DRAW_TEST_DATA[i]['is_approved']
    
    logger.info("✅ Get construction draws test completed")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("draw_data", CONSTRUCTION_DRAW_TEST_DATA)
def test_add_construction_draw(client, test_user, test_property, auth_headers, db_session, logger, draw_data):
    """Test adding a new construction draw"""
    logger.info(f"💸 Starting add construction draw test for {draw_data['description']}...")

    request_data = {
        "property_id": test_property.id,
        "release_date": date.today().isoformat(),
        "amount": draw_data['amount'],
        "bank_account_number": draw_data['bank_account_number'],
        "is_approved": draw_data['is_approved']
    }

    response = client.post('/api/construction-draws',
                         json=request_data,
                         headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 201
    data = response.json
    assert "id" in data
    assert data["message"] == "Construction draw added successfully"

    # Verify draw was added to database
    draw = db_session.query(ConstructionDraw).get(data["id"])
    assert draw is not None
    assert draw.amount == draw_data['amount']
    assert draw.bank_account_number == draw_data['bank_account_number']
    assert draw.is_approved == draw_data['is_approved']
    
    logger.info(f"✅ Add construction draw test completed for {draw_data['description']}")

@pytest.mark.api
@pytest.mark.integration
def test_update_construction_draw(client, test_user, test_property, auth_headers, db_session, logger):
    """Test updating a construction draw"""
    logger.info("🔄 Starting update construction draw test...")
    
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

    logger.debug(f"📝 Created test draw with ID: {draw.id}")

    update_data = {
        "amount": 60000.00,
        "is_approved": True
    }

    response = client.put(f'/api/construction-draws/{draw.id}',
                        json=update_data,
                        headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    assert response.json["message"] == "Construction draw updated successfully"

    # Verify update in database
    updated_draw = db_session.query(ConstructionDraw).get(draw.id)
    assert updated_draw.amount == 60000.00
    assert updated_draw.is_approved == True
    
    logger.info("✅ Update construction draw test completed")

@pytest.mark.api
@pytest.mark.integration
def test_delete_construction_draw(client, test_user, test_property, auth_headers, db_session, logger):
    """Test deleting a construction draw"""
    logger.info("🗑️ Starting delete construction draw test...")
    
    # Create a test draw
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234"
    )
    db_session.add(draw)
    db_session.commit()

    logger.debug(f"📝 Created test draw with ID: {draw.id}")

    response = client.delete(f'/api/construction-draws/{draw.id}',
                           headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    assert response.json["message"] == "Construction draw deleted successfully"

    # Verify deletion
    deleted_draw = db_session.query(ConstructionDraw).get(draw.id)
    assert deleted_draw is None
    
    logger.info("✅ Delete construction draw test completed")

@pytest.mark.api
@pytest.mark.integration
def test_get_receipts(client, test_user, test_property, auth_headers, db_session, logger):
    """Test getting receipts for a property"""
    logger.info("🧾 Starting get receipts test...")
    
    # Create a construction draw first
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234",
        is_approved=False
    )
    db_session.add(draw)
    db_session.commit()
    
    # Create test receipts
    receipts = []
    for receipt_data in RECEIPT_TEST_DATA:
        receipt = Receipt(
            construction_draw_id=draw.id,
            date=date.today(),
            amount=receipt_data['amount'],
            vendor=receipt_data['vendor'],
            description=receipt_data['description']
        )
        receipts.append(receipt)
        db_session.add(receipt)
    db_session.commit()

    logger.debug(f"📊 Created {len(receipts)} test receipts")

    # Test getting receipts
    response = client.get(f'/api/receipts/{test_property.id}', headers=auth_headers)
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    data = response.json
    assert len(data) == len(RECEIPT_TEST_DATA)
    
    for i, receipt_data in enumerate(data):
        assert receipt_data['amount'] == RECEIPT_TEST_DATA[i]['amount']
        assert receipt_data['vendor'] == RECEIPT_TEST_DATA[i]['vendor']
    
    logger.info("✅ Get receipts test completed")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("receipt_data", RECEIPT_TEST_DATA)
def test_add_receipt(client, test_user, test_property, auth_headers, db_session, logger, receipt_data):
    """Test adding a new receipt"""
    logger.info(f"📝 Starting add receipt test for {receipt_data['vendor']}...")

    # Create a construction draw first
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234",
        is_approved=False
    )
    db_session.add(draw)
    db_session.commit()

    request_data = {
        "construction_draw_id": draw.id,
        "date": date.today().isoformat(),
        "amount": receipt_data['amount'],
        "vendor": receipt_data['vendor'],
        "description": receipt_data['description']
    }

    response = client.post('/api/receipts',
                         json=request_data,
                         headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 201
    data = response.json
    assert "id" in data
    assert data["message"] == "Receipt added successfully"

    # Verify receipt was added to database
    receipt = db_session.query(Receipt).get(data["id"])
    assert receipt is not None
    assert receipt.amount == receipt_data['amount']
    assert receipt.vendor == receipt_data['vendor']
    assert receipt.description == receipt_data['description']
    
    logger.info(f"✅ Add receipt test completed for {receipt_data['vendor']}") 