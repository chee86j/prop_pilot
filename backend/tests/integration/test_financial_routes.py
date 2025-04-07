import pytest
from datetime import date, timedelta
from models import db, User, Property, ConstructionDraw, Receipt
from flask_jwt_extended import create_access_token
import logging
import uuid

logger = logging.getLogger(__name__)

# Test data for parametrized tests
CONSTRUCTION_DRAW_TEST_DATA = [
    {
        'amount': 50000.00,
        'bank_account_number': '1234567890',
        'is_approved': True,
        'description': 'First draw'
    },
    {
        'amount': 75000.00,
        'bank_account_number': '0987654321',
        'is_approved': False,
        'description': 'Second draw'
    }
]

RECEIPT_TEST_DATA = [
    {
        'vendor': 'Home Depot',
        'amount': 1500.00,
        'description': 'Building materials',
        'pointofcontact': 'John Smith',
        'ccnumber': '1234'
    },
    {
        'vendor': 'Lowes',
        'amount': 2500.00,
        'description': 'Appliances',
        'pointofcontact': 'Jane Doe',
        'ccnumber': '5678'
    }
]

@pytest.fixture
def test_user(db_session):
    """Create a test user"""
    logger.info('👤 Creating test user')
    unique_id = str(uuid.uuid4())[:8]
    user = User(
        email=f'test_{unique_id}@example.com',
        first_name='Test',
        last_name='User'
    )
    user.set_password('password123')
    db_session.add(user)
    db_session.commit()
    logger.info('✅ Test user created')
    return user

@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers with JWT token"""
    logger.info('🔑 Creating auth headers')
    access_token = create_access_token(identity=test_user.email)
    headers = {'Authorization': f'Bearer {access_token}'}
    logger.info('✅ Auth headers created')
    return headers

@pytest.fixture
def test_property(db_session, test_user):
    """Create a test property"""
    logger.info('🏠 Creating test property')
    property = Property(
        user_id=test_user.id,
        propertyName='Test Property',
        address='123 Test St',
        city='Test City',
        state='IL',
        zipCode='12345',
        purchaseCost=200000.00,
        totalRehabCost=50000.00,
        arvSalePrice=300000.00
    )
    db_session.add(property)
    db_session.commit()
    logger.info('✅ Test property created')
    return property

@pytest.fixture
def test_draw(db_session, test_property):
    """Create a test construction draw"""
    logger.info('💰 Creating test construction draw')
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number='1234567890',
        is_approved=False
    )
    db_session.add(draw)
    db_session.commit()
    logger.info('✅ Test construction draw created')
    return draw

@pytest.fixture
def test_receipt(db_session, test_draw):
    """Create a test receipt"""
    logger.info('🧾 Creating test receipt')
    receipt = Receipt(
        construction_draw_id=test_draw.id,
        date=date.today(),
        vendor='Test Vendor',
        amount=1000.00,
        description='Test Description',
        pointofcontact='Test Contact',
        ccnumber='1234'
    )
    db_session.add(receipt)
    db_session.commit()
    logger.info('✅ Test receipt created')
    return receipt

@pytest.fixture(autouse=True)
def cleanup_financial(db_session):
    """Clean up financial records before each test"""
    logger.info('🧹 Cleaning up financial records')
    db_session.query(Receipt).delete()
    db_session.query(ConstructionDraw).delete()
    db_session.commit()
    logger.info('✅ Financial records cleaned up')
    yield
    # Cleanup after test
    db_session.query(Receipt).delete()
    db_session.query(ConstructionDraw).delete()
    db_session.commit()

# Construction Draw Tests
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
def test_add_construction_draw_invalid_data(client, test_property, auth_headers, logger):
    """Test adding a construction draw with invalid data"""
    logger.info("❌ Starting invalid construction draw test...")

    invalid_test_cases = [
        ({}, "Missing required field"),
        ({"property_id": test_property.id}, "Missing required field"),
        ({
            "property_id": test_property.id,
            "release_date": "invalid-date",
            "amount": 50000.00,
            "bank_account_number": "1234"
        }, "Invalid value"),
        ({
            "property_id": test_property.id,
            "release_date": date.today().isoformat(),
            "amount": "invalid-amount",
            "bank_account_number": "1234"
        }, "Invalid value")
    ]

    for test_data, expected_error in invalid_test_cases:
        response = client.post('/api/construction-draws',
                             json=test_data,
                             headers=auth_headers)
        
        logger.debug(f"📤 Response status: {response.status_code}")
        logger.debug(f"📤 Response data: {response.json}")
        
        assert response.status_code == 400
        assert expected_error in response.json.get('error', '')

    logger.info("✅ Invalid construction draw test completed")

@pytest.mark.api
@pytest.mark.integration
def test_update_construction_draw(client, test_draw, auth_headers, db_session, logger):
    """Test updating a construction draw"""
    logger.info("🔄 Starting update construction draw test...")

    update_data = {
        "amount": 60000.00,
        "is_approved": True
    }

    response = client.put(f'/api/construction-draws/{test_draw.id}',
                        json=update_data,
                        headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    assert response.json["message"] == "Construction draw updated successfully"

    # Verify update in database
    updated_draw = db_session.query(ConstructionDraw).get(test_draw.id)
    assert updated_draw.amount == 60000.00
    assert updated_draw.is_approved == True
    
    logger.info("✅ Update construction draw test completed")

@pytest.mark.api
@pytest.mark.integration
def test_delete_construction_draw(client, test_draw, auth_headers, db_session, logger):
    """Test deleting a construction draw"""
    logger.info("🗑️ Starting delete construction draw test...")

    response = client.delete(f'/api/construction-draws/{test_draw.id}',
                           headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    assert response.json["message"] == "Construction draw deleted successfully"

    # Verify deletion in database
    deleted_draw = db_session.query(ConstructionDraw).get(test_draw.id)
    assert deleted_draw is None
    
    logger.info("✅ Delete construction draw test completed")

# Receipt Tests
@pytest.mark.api
@pytest.mark.integration
def test_get_receipts(client, test_draw, auth_headers, db_session, logger):
    """Test getting receipts for a construction draw"""
    logger.info("🧾 Starting get receipts test...")
    
    # Create test receipts
    receipts = []
    for receipt_data in RECEIPT_TEST_DATA:
        receipt = Receipt(
            construction_draw_id=test_draw.id,
            date=date.today(),
            vendor=receipt_data['vendor'],
            amount=receipt_data['amount'],
            description=receipt_data['description'],
            pointofcontact=receipt_data['pointofcontact'],
            ccnumber=receipt_data['ccnumber']
        )
        receipts.append(receipt)
        db_session.add(receipt)
    db_session.commit()

    logger.debug(f"📊 Created {len(receipts)} test receipts")

    response = client.get(f'/api/receipts/{test_draw.id}', headers=auth_headers)
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    data = response.json
    assert len(data) == len(RECEIPT_TEST_DATA)
    
    for i, receipt_data in enumerate(data):
        assert receipt_data['vendor'] == RECEIPT_TEST_DATA[i]['vendor']
        assert receipt_data['amount'] == RECEIPT_TEST_DATA[i]['amount']
    
    logger.info("✅ Get receipts test completed")

@pytest.mark.api
@pytest.mark.integration
@pytest.mark.parametrize("receipt_data", RECEIPT_TEST_DATA)
def test_add_receipt(client, test_draw, auth_headers, db_session, logger, receipt_data):
    """Test adding a new receipt"""
    logger.info(f"📝 Starting add receipt test for {receipt_data['vendor']}...")

    request_data = {
        "construction_draw_id": test_draw.id,
        "date": date.today().isoformat(),
        **receipt_data
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
    assert receipt.vendor == receipt_data['vendor']
    assert receipt.amount == receipt_data['amount']
    
    logger.info(f"✅ Add receipt test completed for {receipt_data['vendor']}")

@pytest.mark.api
@pytest.mark.integration
def test_add_receipt_invalid_data(client, test_draw, auth_headers, logger):
    """Test adding a receipt with invalid data"""
    logger.info("❌ Starting invalid receipt test...")

    invalid_test_cases = [
        ({}, "Missing required field"),
        ({"construction_draw_id": test_draw.id}, "Missing required field"),
        ({
            "construction_draw_id": test_draw.id,
            "date": "invalid-date",
            "vendor": "Test Vendor",
            "amount": 1000.00
        }, "Invalid value"),
        ({
            "construction_draw_id": test_draw.id,
            "date": date.today().isoformat(),
            "vendor": "Test Vendor",
            "amount": "invalid-amount"
        }, "Invalid value")
    ]

    for test_data, expected_error in invalid_test_cases:
        response = client.post('/api/receipts',
                             json=test_data,
                             headers=auth_headers)
        
        logger.debug(f"📤 Response status: {response.status_code}")
        logger.debug(f"📤 Response data: {response.json}")
        
        assert response.status_code == 400
        assert expected_error in response.json.get('error', '')

    logger.info("✅ Invalid receipt test completed")

@pytest.mark.api
@pytest.mark.integration
def test_update_receipt(client, test_receipt, auth_headers, db_session, logger):
    """Test updating a receipt"""
    logger.info("🔄 Starting update receipt test...")

    update_data = {
        "vendor": "Updated Vendor",
        "amount": 2000.00,
        "description": "Updated Description"
    }

    response = client.put(f'/api/receipts/{test_receipt.id}',
                        json=update_data,
                        headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    assert response.json["message"] == "Receipt updated successfully"

    # Verify update in database
    updated_receipt = db_session.query(Receipt).get(test_receipt.id)
    assert updated_receipt.vendor == "Updated Vendor"
    assert updated_receipt.amount == 2000.00
    assert updated_receipt.description == "Updated Description"
    
    logger.info("✅ Update receipt test completed")

@pytest.mark.api
@pytest.mark.integration
def test_delete_receipt(client, test_receipt, auth_headers, db_session, logger):
    """Test deleting a receipt"""
    logger.info("🗑️ Starting delete receipt test...")

    response = client.delete(f'/api/receipts/{test_receipt.id}',
                           headers=auth_headers)
    
    logger.debug(f"📤 Response status: {response.status_code}")
    
    assert response.status_code == 200
    assert response.json["message"] == "Receipt deleted successfully"

    # Verify deletion in database
    deleted_receipt = db_session.query(Receipt).get(test_receipt.id)
    assert deleted_receipt is None
    
    logger.info("✅ Delete receipt test completed") 