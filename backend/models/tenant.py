from sqlalchemy import Index, event
from .base import db
import re
from datetime import date, datetime

class ValidationError(Exception):
    """Custom validation error class for model validation."""
    pass

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

    def validate_email(self):
        """Validate email format using regex pattern."""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, self.email):
            raise ValidationError('Invalid email format')

    def validate_phone_number(self):
        """Validate phone number format if provided."""
        if self.phoneNumber:
            # Remove any non-digit characters for validation
            cleaned_number = re.sub(r'\D', '', self.phoneNumber)
            if not (10 <= len(cleaned_number) <= 11):  # Allow for optional country code
                raise ValidationError('Phone number must be 10-11 digits')

    def validate_credit_score(self):
        """Validate credit score range if provided."""
        for score in [self.creditScoreAtInitialApplication, self.creditScoreAtLeaseRenewal]:
            if score is not None and not (300 <= score <= 850):
                raise ValidationError('Credit score must be between 300 and 850')

    def validate_date_of_birth(self):
        """Validate tenant is at least 18 years old."""
        if self.dateOfBirth:
            today = date.today()
            age = today.year - self.dateOfBirth.year - ((today.month, today.day) < (self.dateOfBirth.month, self.dateOfBirth.day))
            if age < 18:
                raise ValidationError('Tenant must be at least 18 years old')

    def validate_name_fields(self):
        """Validate name fields contain only letters, spaces, hyphens and apostrophes."""
        name_pattern = r'^[a-zA-Z\s\'-]+$'
        if not re.match(name_pattern, self.firstName) or not re.match(name_pattern, self.lastName):
            raise ValidationError('Names can only contain letters, spaces, hyphens and apostrophes')

    def validate_tenant(self):
        """Run all validation checks."""
        self.validate_email()
        self.validate_phone_number()
        self.validate_credit_score()
        self.validate_date_of_birth()
        self.validate_name_fields()

@event.listens_for(Tenant, 'before_insert')
@event.listens_for(Tenant, 'before_update')
def validate_tenant_before_save(mapper, connection, target):
    """Validate tenant before saving to database."""
    target.validate_tenant()

class Lease(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenantId = db.Column(db.Integer, db.ForeignKey('tenant.id', ondelete='CASCADE'), nullable=False)  # Many to one relationship w/Tenant
    propertyId = db.Column(db.Integer, db.ForeignKey('property.id', ondelete='CASCADE'), nullable=False)  # Many to one relationship w/Property
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)
    rentAmount = db.Column(db.Float, nullable=False)
    renewalCondition = db.Column(db.String(255), nullable=True)
    typeOfLease = db.Column(db.String(100), nullable=False)  # Examples: "Fixed", "Month-to-Month", "Lease to Own", etc.