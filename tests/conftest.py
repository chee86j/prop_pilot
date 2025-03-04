import sys
import os
from pathlib import Path
from datetime import date, datetime
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import event
import pytest
import logging
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Add the project root directory to Python path
project_root = str(Path(__file__).parent.parent)
sys.path.insert(0, project_root)

from flask import Flask
from models import db, User, Property, Tenant
from flask_jwt_extended import create_access_token

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
            logging.FileHandler(f'logs/test_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
            logging.StreamHandler()
        ]
    )

@pytest.fixture(scope='session')
def logger():
    """Provide a logger fixture for tests"""
    return logging.getLogger('tests')

@pytest.fixture(scope='session')
def app():
    """Create a Flask application for testing"""
    # Create a new Flask app for testing
    test_app = Flask(__name__)
    
    # Configure the Flask app for testing
    test_app.config.update({
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'TESTING': True,
        'JWT_SECRET_KEY': 'test-secret-key',
        'WTF_CSRF_ENABLED': False
    })

    # Initialize extensions with the test app
    db.init_app(test_app)
    jwt = JWTManager(test_app)
    CORS(test_app)
    
    # Register blueprints
    from routes import api
    test_app.register_blueprint(api, url_prefix='/api')
    
    with test_app.app_context():
        # Create all tables
        db.create_all()
        
        # Return the app for testing
        yield test_app
        
        # Cleanup after all tests
        db.session.remove()
        db.drop_all()

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
def db_session(app):
    """Create a fresh database session for a test"""
    with app.app_context():
        connection = db.engine.connect()
        transaction = connection.begin()
        
        # Create a session bound to the connection
        session_factory = sessionmaker(bind=connection)
        session = scoped_session(session_factory)
        
        # Begin a nested transaction
        nested = connection.begin_nested()
        
        # If the application code calls session.commit, it will end the nested
        # transaction. Use this hook to start a new one
        @event.listens_for(session, 'after_transaction_end')
        def end_savepoint(session, transaction):
            nonlocal nested
            if not nested.is_active:
                nested = connection.begin_nested()
        
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
def test_user(db_session):
    """Create a test user"""
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
        arvSalePrice=200000
    )
    db_session.add(property)
    db_session.commit()
    return property

@pytest.fixture
def test_tenant(db_session):
    """Create a test tenant"""
    tenant = Tenant(
        firstName="John",
        lastName="Doe",
        email="john@example.com",
        phoneNumber="123-456-7890",
        dateOfBirth=date(1990, 1, 1),
        occupation="Software Engineer"
    )
    db_session.add(tenant)
    db_session.commit()
    return tenant 