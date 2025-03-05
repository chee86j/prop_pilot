import pytest
from seed import seed_database
from models import db, User, Property, Tenant, Lease
from reset_db import reset_database

@pytest.fixture(autouse=True)
def reset_before_test(app):
    """Reset database before each test"""
    with app.app_context():
        reset_database()

def test_seed_database(app):
    """Test database seeding functionality"""
    with app.app_context():
        # Reset database with testing flag
        reset_database(testing=True)
        
        # Seed database
        seed_database()
        
        # Verify users were created
        users = User.query.all()
        assert len(users) > 0
        
        # Verify properties were created
        properties = Property.query.all()
        assert len(properties) > 0
        
        # Verify tenants were created
        tenants = Tenant.query.all()
        assert len(tenants) > 0
        
        # Verify leases were created
        leases = Lease.query.all()
        assert len(leases) > 0
        
        # Verify relationships
        for lease in leases:
            assert lease.tenant is not None
            assert lease.property is not None
            
        for property in properties:
            assert property.user is not None
            
        for tenant in tenants:
            assert tenant.manager is not None

def test_seed_database_idempotency(app):
    """Test that seeding database multiple times doesn't cause errors"""
    with app.app_context():
        # Reset and seed database
        reset_database(testing=True)
        seed_database()
        initial_counts = {
            'users': User.query.count(),
            'properties': Property.query.count(),
            'tenants': Tenant.query.count(),
            'leases': Lease.query.count()
        }
        
        # Reset and seed again
        reset_database(testing=True)
        seed_database()
        final_counts = {
            'users': User.query.count(),
            'properties': Property.query.count(),
            'tenants': Tenant.query.count(),
            'leases': Lease.query.count()
        }
        
        # Counts should be the same
        assert initial_counts == final_counts

def test_seed_data_validity(app):
    """Test that seeded data is valid"""
    with app.app_context():
        seed_database()
        
        # Check user data
        users = User.query.all()
        for user in users:
            assert user.email is not None
            assert '@' in user.email
            assert user.first_name is not None
            assert user.last_name is not None
            assert user.password_hash is not None
        
        # Check property data
        properties = Property.query.all()
        for property in properties:
            assert property.propertyName is not None
            assert property.address is not None
            assert property.city is not None
            assert property.state is not None
            assert len(property.state) == 2  # State should be 2-letter code
            assert property.zipCode is not None
            assert len(property.zipCode) == 5  # ZIP should be 5 digits
        
        # Check tenant data
        tenants = Tenant.query.all()
        for tenant in tenants:
            assert tenant.firstName is not None
            assert tenant.lastName is not None
            assert tenant.email is not None
            assert '@' in tenant.email
            assert tenant.phoneNumber is not None
        
        # Check lease data
        leases = Lease.query.all()
        for lease in leases:
            assert lease.startDate is not None
            assert lease.endDate is not None
            assert lease.endDate > lease.startDate
            assert lease.rentAmount > 0
            assert lease.typeOfLease in ['Fixed', 'Month-to-Month'] 