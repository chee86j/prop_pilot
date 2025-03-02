import pytest
from models import User
from werkzeug.security import check_password_hash

def test_new_user(db_session):
    """Test creating a new user"""
    user = User(
        first_name="Test",
        last_name="User",
        email="test@example.com"
    )
    user.set_password("TestPass123!")
    db_session.add(user)
    db_session.commit()

    retrieved_user = User.query.filter_by(email="test@example.com").first()
    assert retrieved_user is not None
    assert retrieved_user.first_name == "Test"
    assert retrieved_user.last_name == "User"
    assert retrieved_user.check_password("TestPass123!")

def test_password_hashing(db_session):
    """Test password hashing works correctly"""
    user = User(
        first_name="Test",
        last_name="User",
        email="test@example.com"
    )
    user.set_password("TestPass123!")
    
    assert user.password_hash is not None
    assert user.password_hash != "TestPass123!"
    assert user.check_password("TestPass123!")
    assert not user.check_password("WrongPassword!")

def test_user_properties_relationship(db_session):
    """Test user-properties relationship"""
    from models import Property
    
    user = User(
        first_name="Test",
        last_name="User",
        email="test@example.com"
    )
    user.set_password("TestPass123!")
    db_session.add(user)
    db_session.commit()

    property1 = Property(
        user_id=user.id,
        propertyName="Test Property 1",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345",
        purchaseCost=100000,
        totalRehabCost=50000,
        arvSalePrice=200000
    )
    db_session.add(property1)
    db_session.commit()

    assert len(user.properties.all()) == 1
    assert user.properties.first().propertyName == "Test Property 1"

def test_duplicate_email(db_session):
    """Test that duplicate emails are not allowed"""
    user1 = User(
        first_name="Test1",
        last_name="User1",
        email="same@example.com"
    )
    user2 = User(
        first_name="Test2",
        last_name="User2",
        email="same@example.com"
    )
    
    db_session.add(user1)
    db_session.commit()
    
    db_session.add(user2)
    with pytest.raises(Exception):  # Should raise IntegrityError
        db_session.commit() 