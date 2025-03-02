import pytest
from models import ConstructionDraw, Receipt, Property
from datetime import date, timedelta

def test_new_construction_draw(db_session, test_property):
    """Test creating a new construction draw"""
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234",
        is_approved=False
    )
    db_session.add(draw)
    db_session.commit()

    retrieved_draw = db_session.query(ConstructionDraw).first()
    assert retrieved_draw is not None
    assert retrieved_draw.amount == 50000.00
    assert retrieved_draw.bank_account_number == "1234"
    assert not retrieved_draw.is_approved

def test_construction_draw_property_relationship(db_session, test_property):
    """Test construction draw-property relationship"""
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

    # Test the relationship from both directions
    property_draws = db_session.query(ConstructionDraw).filter_by(property_id=test_property.id).all()
    assert len(property_draws) == 1
    assert property_draws[0] == draw
    assert draw.property == test_property

def test_construction_draw_receipts_relationship(db_session, test_property):
    """Test construction draw-receipts relationship"""
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

    # Create multiple receipts for the draw
    receipts = []
    for i in range(3):
        receipt = Receipt(
            property_id=test_property.id,
            construction_draw_id=draw.id,
            date=date.today(),
            vendor=f"Vendor {i}",
            amount=10000.00,
            description=f"Receipt {i}"
        )
        receipts.append(receipt)
        db_session.add(receipt)
    db_session.commit()

    # Test the relationship
    draw_receipts = db_session.query(Receipt).filter_by(construction_draw_id=draw.id).all()
    assert len(draw_receipts) == 3
    assert draw_receipts[0].vendor == "Vendor 0"
    for receipt in receipts:
        assert receipt.construction_draw == draw

def test_construction_draw_required_fields(db_session, test_property):
    """Test that required fields are enforced"""
    # Test missing release_date
    with pytest.raises(Exception):
        draw = ConstructionDraw(
            property_id=test_property.id,
            amount=50000.00,
            bank_account_number="1234"
        )
        db_session.add(draw)
        db_session.commit()

    db_session.rollback()

    # Test missing amount
    with pytest.raises(Exception):
        draw = ConstructionDraw(
            property_id=test_property.id,
            release_date=date.today(),
            bank_account_number="1234"
        )
        db_session.add(draw)
        db_session.commit()

def test_construction_draw_default_values(db_session, test_property):
    """Test default values for construction draw"""
    draw = ConstructionDraw(
        property_id=test_property.id,
        release_date=date.today(),
        amount=50000.00,
        bank_account_number="1234"
    )
    db_session.add(draw)
    db_session.commit()

    assert draw.is_approved == False  # Default value should be False 