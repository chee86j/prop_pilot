import pytest
from reset_db import reset_database
from models import db, User, Property, Tenant, Lease, Phase, ConstructionDraw, Receipt, PropertyMaintenanceRequest
from sqlalchemy import inspect

def test_reset_database(app):
    """Test database reset functionality"""
    with app.app_context():
        # Add some test data
        user = User(
            first_name='Test',
            last_name='User',
            email='test@example.com'
        )
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        
        # Verify data exists
        assert User.query.count() == 1
        
        # Reset database with testing flag
        reset_database(testing=True)
        
        # Verify all tables are empty
        assert User.query.count() == 0
        assert Property.query.count() == 0
        assert Phase.query.count() == 0
        assert ConstructionDraw.query.count() == 0
        assert Receipt.query.count() == 0
        assert Lease.query.count() == 0
        assert PropertyMaintenanceRequest.query.count() == 0
        assert Tenant.query.count() == 0
        
        # Verify tables exist
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        assert 'user' in tables
        assert 'property' in tables
        assert 'tenant' in tables
        assert 'lease' in tables

def test_reset_database_with_existing_tables(app):
    """Test database reset when tables already exist"""
    with app.app_context():
        # Reset database twice
        reset_database()
        reset_database()
        
        # Verify tables exist
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        assert 'user' in tables
        assert 'property' in tables
        assert 'tenant' in tables
        assert 'lease' in tables 