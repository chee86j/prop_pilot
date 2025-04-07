import pytest
from reset_db import create_app
from models import db, User, Property
import os

@pytest.fixture
def test_app():
    """Create a test application instance"""
    app, database, migrate = create_app(testing=True)
    with app.app_context():
        database.create_all()
        yield app
        database.session.remove()
        database.drop_all()

def test_app_creation_testing_mode(test_app):
    """Test that app is created correctly in testing mode"""
    assert test_app.config['SQLALCHEMY_DATABASE_URI'].endswith('_test')
    assert not test_app.config['SQLALCHEMY_TRACK_MODIFICATIONS']

def test_database_tables_exist(test_app):
    """Test that all required database tables are created"""
    with test_app.app_context():
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        # Check for essential tables
        essential_tables = ['user', 'property', 'phase', 'construction_draw',
                          'receipt', 'lease', 'property_maintenance_request', 'tenant']
        for table in essential_tables:
            assert table in tables

def test_database_relationships(test_app):
    """Test that database relationships are properly set up"""
    with test_app.app_context():
        # Create test user and property
        test_user = User(
            email='test@example.com',
            password_hash='dummy_hash',
            first_name='Test',
            last_name='User'
        )
        db.session.add(test_user)
        db.session.commit()
        
        test_property = Property(
            address='123 Test St',
            owner_id=test_user.id,
            purchase_price=100000
        )
        db.session.add(test_property)
        db.session.commit()
        
        # Test relationships
        assert test_property in test_user.properties
        assert test_property.owner == test_user 