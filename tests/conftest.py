import sys
import os
from pathlib import Path
from datetime import date, datetime, timedelta
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import event
import pytest
import logging
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
import uuid
from dotenv import load_dotenv
from app import create_app
from models import db as _db

# Load environment variables
load_dotenv()

# Add the project root directory to Python path
project_root = str(Path(__file__).parent.parent)
sys.path.insert(0, project_root)

from flask import Flask
from models import User, Property, Tenant
from routes import api

# Test data constants
TENANT_DATA = {
    'firstName': 'John',
    'lastName': 'Doe',
    'email': f'john_{str(uuid.uuid4())[:8]}@example.com',
    'phoneNumber': '123-456-7890',
    'dateOfBirth': date(1990, 1, 1).isoformat(),
    'occupation': 'Software Engineer',
    'creditScoreAtInitialApplication': 750,
    'creditCheck1Complete': True
}

def pytest_configure(config):
    """Configure logging for tests"""
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')

    # Set up logging configuration
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(f'logs/test_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log', encoding='utf-8'),
            logging.StreamHandler(sys.stdout)
        ]
    )

@pytest.fixture
def logger():
    """Create a test logger"""
    logger = logging.getLogger('tests')
    logger.setLevel(logging.INFO)
    return logger

@pytest.fixture(scope='session')
def app():
    """Create a Flask application for testing"""
    os.environ['FLASK_ENV'] = 'testing'
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/prop_pilot_test'
    
    return app

@pytest.fixture(scope='session')
def db(app):
    """Create database tables"""
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.remove()
        _db.drop_all()

@pytest.fixture(scope='function')
def db_session(db, app):
    """Create a new database session for a test"""
    with app.app_context():
        connection = db.engine.connect()
        transaction = connection.begin()
        
        # Create a session factory bound to the connection
        session_factory = sessionmaker(bind=connection)
        session = scoped_session(session_factory)
        
        # Make this session the scoped session used by the app
        old_session = db.session
        db.session = session
        
        yield session
        
        # Cleanup
        db.session = old_session
        session.remove()
        transaction.rollback()
        connection.close()

@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()

@pytest.fixture(autouse=True)
def app_context(app):
    """Ensure we always have an app context"""
    with app.app_context():
        yield

@pytest.fixture
def test_user(db_session):
    """Create a test user"""
    unique_id = str(uuid.uuid4())[:8]
    user = User(
        email=f'test_{unique_id}@example.com',
        first_name='Test',
        last_name='User',
        avatar='https://example.com/avatar.jpg'
    )
    user.set_password('TestPass123!')
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)  # Refresh the instance to ensure it's attached to the session
    return user

@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers for a test user"""
    access_token = create_access_token(identity=test_user.email)
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture
def test_property(db_session, test_user):
    """Create a test property"""
    property = Property(
        user_id=test_user.id,
        propertyName="Test Property",
        address="123 Test St",
        city="Test City",
        state="TS",
        zipCode="12345",
        purchaseCost=100000,
        totalRehabCost=50000,
        utilitiesCost=200,
        yearlyPropertyTaxes=2000,
        homeownersInsurance=1000,
        mortgagePaid=800
    )
    db_session.add(property)
    db_session.commit()
    db_session.refresh(property)  # Refresh the instance to ensure it's attached to the session
    return property

@pytest.fixture
def test_tenant(db_session, test_user):
    """Create a test tenant"""
    unique_id = str(uuid.uuid4())[:8]
    tenant = Tenant(
        firstName="John",
        lastName="Doe",
        email=f"tenant_{unique_id}@example.com",
        phoneNumber="123-456-7890",
        dateOfBirth=date(1990, 1, 1),
        occupation="Software Engineer",
        manager_id=test_user.id
    )
    db_session.add(tenant)
    db_session.commit()
    db_session.refresh(tenant)  # Refresh the instance to ensure it's attached to the session
    return tenant

PROPERTY_TEST_DATA = [
    {
        'propertyName': 'Suburban House',
        'address': '123 Maple St',
        'city': 'Springfield',
        'state': 'IL',
        'zipCode': '62701',
        'purchaseCost': 180000.0,
        'totalRehabCost': 45000.0,
        'arvSalePrice': 280000.0
    },
    {
        'propertyName': 'Downtown Condo',
        'address': '456 Urban Ave',
        'city': 'Chicago',
        'state': 'IL',
        'zipCode': '60601',
        'purchaseCost': 250000.0,
        'totalRehabCost': 30000.0,
        'arvSalePrice': 350000.0
    }
]

# Test data fixtures
USER_TEST_DATA = [
    {
        'description': 'user with valid data',
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'password': 'SecurePass123!'
    },
    {
        'description': 'user with different data',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'email': 'jane.doe@example.com',
        'password': 'AnotherPass456!'
    }
]

TENANT_TEST_DATA = [
    {
        'description': 'tenant with valid data',
        'first_name': 'Bob',
        'last_name': 'Smith',
        'email': 'bob.smith@example.com',
        'phone': '123-456-7890'
    },
    {
        'description': 'tenant with different data',
        'first_name': 'Alice',
        'last_name': 'Johnson',
        'email': 'alice.j@example.com',
        'phone': '098-765-4321'
    },
    {
        'description': 'tenant with minimal data',
        'first_name': 'Mike',
        'last_name': 'Brown',
        'email': 'mike.b@example.com',
        'phone': None
    }
]

LEASE_TEST_DATA = [
    {
        'description': 'lease with valid data',
        'start_date': '2024-01-01',
        'end_date': '2024-12-31',
        'monthly_rent': 1500,
        'security_deposit': 2000
    },
    {
        'description': 'lease with different data',
        'start_date': '2024-02-01',
        'end_date': '2025-01-31',
        'monthly_rent': 2000,
        'security_deposit': 3000
    }
]

@pytest.fixture
def test_user_data():
    """Generate unique test user data"""
    unique_id = str(uuid.uuid4())[:8]
    return {
        'first_name': 'Test',
        'last_name': 'User',
        'email': f'test_{unique_id}@example.com',
        'password': 'TestPass123!'
    }

@pytest.fixture
def test_tenant_data():
    """Generate unique test tenant data"""
    unique_id = str(uuid.uuid4())[:8]
    return {
        'first_name': 'Test',
        'last_name': 'Tenant',
        'email': f'tenant_{unique_id}@example.com',
        'phone': f'555-{unique_id[:3]}-{unique_id[3:7]}'
    }

@pytest.fixture
def test_property_data():
    """Generate test property data"""
    return {
        'address': '123 Test St',
        'purchase_price': 200000,
        'current_phase': 'ACQUISITION'
    } 