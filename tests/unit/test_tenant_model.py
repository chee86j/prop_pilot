import pytest
from models import Tenant, Lease
from datetime import date

def test_new_tenant(db_session):
    """Test creating a new tenant"""
    tenant = Tenant(
        firstName="John",
        lastName="Doe",
        email="john@example.com",
        dateOfBirth=date(1990, 1, 1),
        phoneNumber="123-456-7890",
        occupation="Software Engineer",
        creditScoreAtInitialApplication=750,
        creditCheck1Complete=True
    )
    db_session.add(tenant)
    db_session.commit()

    retrieved_tenant = Tenant.query.first()
    assert retrieved_tenant is not None
    assert retrieved_tenant.firstName == "John"
    assert retrieved_tenant.lastName == "Doe"
    assert retrieved_tenant.creditScoreAtInitialApplication == 750

def test_tenant_lease_relationship(db_session):
    """Test tenant-lease relationship"""
    tenant = Tenant(
        firstName="John",
        lastName="Doe",
        email="john@example.com",
        dateOfBirth=date(1990, 1, 1),
        phoneNumber="123-456-7890"
    )
    db_session.add(tenant)
    db_session.commit()

    lease = Lease(
        tenant_id=tenant.id,
        property_id=1,  # You might want to create a property first
        startDate=date.today(),
        endDate=date(2024, 12, 31),
        monthlyRent=1500
    )
    db_session.add(lease)
    db_session.commit()

    assert len(tenant.leases) == 1
    assert tenant.leases[0].monthlyRent == 1500 