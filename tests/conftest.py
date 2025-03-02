import sys
import os
from pathlib import Path
from datetime import date
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import event

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
        connection = db.engine.connect()
        transaction = connection.begin()
        
        # Create a session factory bound to the connection
        session_factory = sessionmaker(bind=connection)
        
        # Create a scoped session
        session = scoped_session(session_factory)
        
        # Begin a nested transaction
        nested = connection.begin_nested()
        
        # If the application code calls session.commit, it will end the nested
        # transaction. Use this hook to start a new one
        @event.listens_for(session(), 'after_transaction_end')
        def end_savepoint(session, transaction):
            nonlocal nested
            if not nested.is_active:
                nested = connection.begin_nested()
                
        yield session
        
        # Rollback everything
        session.remove()
        transaction.rollback()
        connection.close()

@pytest.fixture
def test_user(db_session):
    user = User(
        first_name="Test",
        last_name="User",
        email="test@example.com"
    )
    user.set_password("password123")
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def auth_headers(test_user):
    access_token = create_access_token(identity=test_user.email)
    return {"Authorization": f"Bearer {access_token}"}

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
def test_tenant(db_session):
    tenant = Tenant(
        firstName="John",
        lastName="Doe",
        email="john@example.com",
        phone="123-456-7890"
    )
    db_session.add(tenant)
    db_session.commit()
    return tenant 