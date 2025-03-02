import sys
import os
from pathlib import Path
from datetime import date

# Add the project root directory to Python path
project_root = str(Path(__file__).parent.parent)
sys.path.insert(0, project_root)

import pytest
from flask import Flask
from models import db, User, Property, Tenant
from app import app as flask_app
from flask_jwt_extended import create_access_token

@pytest.fixture
def app():
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    flask_app.config['TESTING'] = True
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db_session(app):
    with app.app_context():
        yield db.session 

@pytest.fixture
def test_user(db_session):
    user = User(
        first_name="Test",
        last_name="User",
        email="test@example.com"
    )
    user.set_password("TestPass123!")
    db_session.add(user)
    db_session.commit()
    return user 

@pytest.fixture
def test_property(db_session, test_user):
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345",
        purchaseCost=100000,
        totalRehabCost=50000,
        arvSalePrice=200000
    )
    db_session.add(property)
    db_session.commit()
    return property

@pytest.fixture
def test_tenant(db_session, test_user):
    tenant = Tenant(
        manager_id=test_user.id,
        firstName="John",
        lastName="Doe",
        email="john@example.com",
        dateOfBirth=date(1990, 1, 1)
    )
    db_session.add(tenant)
    db_session.commit()
    return tenant

@pytest.fixture
def auth_headers(test_user):
    access_token = create_access_token(identity=test_user.email)
    return {"Authorization": f"Bearer {access_token}"} 