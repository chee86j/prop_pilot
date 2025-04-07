import pytest
from models import ConstructionDraw, Receipt, Property
from datetime import date, timedelta

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
        'vendor': 'Home Depot',
        'amount': 10000.00,
        'description': 'Building materials'
    },
    {
        'vendor': 'Lowes',
        'amount': 15000.00,
        'description': 'Electrical supplies'
    },
    {
        'vendor': 'Local Lumber Co',
        'amount': 20000.00,
        'description': 'Lumber materials'
    }
]

INVALID_DRAW_TEST_CASES = [
    {
        'case': 'missing_release_date',
        'data': {
            'amount': 50000.00,
            'bank_account_number': '1234'
        },
        'description': 'Missing release date'
    },
    {
        'case': 'missing_amount',
        'data': {
            'release_date': date.today(),
            'bank_account_number': '1234'
        },
        'description': 'Missing amount'
    }
]

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("draw_data", CONSTRUCTION_DRAW_TEST_DATA)
def test_new_construction_draw(db_session, test_property, logger, draw_data):
    """Test creating a new construction draw"""
    logger.info(f"💰 Starting new construction draw test for {draw_data['description']}...")
    
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=draw_data['amount'],
        bank_account_number=draw_data['bank_account_number'],
        is_approved=draw_data['is_approved']
    )
    
    logger.debug(f"📝 {draw.amount = }")
    logger.debug(f"🏦 {draw.bank_account_number = }")
    
    db_session.add(draw)
    db_session.commit()

    retrieved_draw = db_session.query(ConstructionDraw).first()
    assert retrieved_draw is not None
    assert retrieved_draw.amount == draw_data['amount']
    assert retrieved_draw.bank_account_number == draw_data['bank_account_number']
    assert retrieved_draw.is_approved == draw_data['is_approved']
    
    logger.info(f"✅ New construction draw test completed for {draw_data['description']}")

@pytest.mark.model
@pytest.mark.unit
def test_construction_draw_property_relationship(db_session, test_property, logger):
    """Test construction draw-property relationship"""
    logger.info("🔗 Starting construction draw-property relationship test...")
    
    # Create a construction draw associated with the property
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=75000.00,
        bank_account_number="5678",
        is_approved=True
    )
    db_session.add(draw)
    db_session.commit()

    logger.debug(f"📝 Created draw with ID: {draw.id}")

    # Test the relationship from both directions
    property_draws = db_session.query(ConstructionDraw).filter_by(property_id=test_property.id).all()
    assert len(property_draws) == 1
    assert property_draws[0] == draw
    assert draw.property == test_property
    
    logger.info("✅ Construction draw-property relationship test completed")

@pytest.mark.model
@pytest.mark.unit
def test_construction_draw_receipts_relationship(db_session, test_property, logger):
    """Test construction draw-receipts relationship"""
    logger.info("🧾 Starting construction draw-receipts relationship test...")
    
    # Create a construction draw
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=100000.00,
        bank_account_number="9012",
        is_approved=True
    )
    db_session.add(draw)
    db_session.commit()

    logger.debug(f"📝 Created draw with ID: {draw.id}")

    # Create multiple receipts for the draw
    receipts = []
    for receipt_data in RECEIPT_TEST_DATA:
        receipt = Receipt(
            construction_draw_id=draw.id,
            date=date.today(),
            vendor=receipt_data['vendor'],
            amount=receipt_data['amount'],
            description=receipt_data['description']
        )
        receipts.append(receipt)
        db_session.add(receipt)
    db_session.commit()

    logger.debug(f"📊 Created {len(receipts)} receipts")

    # Test the relationship
    draw_receipts = db_session.query(Receipt).filter_by(construction_draw_id=draw.id).all()
    assert len(draw_receipts) == len(RECEIPT_TEST_DATA)
    assert draw_receipts[0].vendor == RECEIPT_TEST_DATA[0]['vendor']
    for receipt in receipts:
        assert receipt.construction_draw == draw
    
    logger.info("✅ Construction draw-receipts relationship test completed")

@pytest.mark.model
@pytest.mark.unit
@pytest.mark.parametrize("test_case", INVALID_DRAW_TEST_CASES)
def test_construction_draw_required_fields(db_session, test_property, logger, test_case):
    """Test that required fields are enforced"""
    logger.info(f"❌ Starting required fields test for {test_case['description']}...")
    
    with pytest.raises(Exception):
        draw = ConstructionDraw(
            property_id=test_property.id,
            **test_case['data']
        )
        db_session.add(draw)
        db_session.commit()

    db_session.rollback()
    logger.info(f"✅ Required fields test completed for {test_case['description']}")

@pytest.mark.model
@pytest.mark.unit
def test_construction_draw_default_values(db_session, test_property, logger):
    """Test default values for construction draw"""
    logger.info("⚙️ Starting default values test...")
    
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234"
    )
    
    logger.debug(f"📝 {draw.amount = }")
    logger.debug(f"🏦 {draw.bank_account_number = }")
    
    db_session.add(draw)
    db_session.commit()

    assert draw.is_approved == False  # Default value should be False
    
    logger.info("✅ Default values test completed") 