from sqlalchemy import Index
from .base import db

class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    phoneNumber = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    dateOfBirth = db.Column(db.Date, nullable=False)
    occupation = db.Column(db.String(255), nullable=True)
    employerName = db.Column(db.String(255), nullable=True)
    professionalTitle = db.Column(db.String(255), nullable=True)
    creditScoreAtInitialApplication = db.Column(db.Integer)
    creditCheck1Complete = db.Column(db.Boolean)
    creditScoreAtLeaseRenewal = db.Column(db.Integer)
    creditCheck2Complete = db.Column(db.Boolean)
    guarantor = db.Column(db.String(255), nullable=True)
    petsAllowed = db.Column(db.Boolean, default=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'))  # Link back to the manager(user) who manages this tenant
    leases = db.relationship('Lease', backref='tenant', lazy=True)  # One to many relationship w/Lease

    __table_args__ = (Index('idx_tenant_manager', 'manager_id'),)  # Index for manager queries


class Lease(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenantId = db.Column(db.Integer, db.ForeignKey('tenant.id', ondelete='CASCADE'), nullable=False)  # Many to one relationship w/Tenant
    propertyId = db.Column(db.Integer, db.ForeignKey('property.id', ondelete='CASCADE'), nullable=False)  # Many to one relationship w/Property
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)
    rentAmount = db.Column(db.Float, nullable=False)
    renewalCondition = db.Column(db.String(255), nullable=True)
    typeOfLease = db.Column(db.String(100), nullable=False)  # Examples: "Fixed", "Month-to-Month", "Lease to Own", etc. 