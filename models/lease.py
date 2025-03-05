from datetime import datetime
from sqlalchemy import event
from . import db
from .exceptions import ValidationError

class Lease(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenantId = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    propertyId = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)
    rentAmount = db.Column(db.Float, nullable=False)
    renewalCondition = db.Column(db.String(500))
    typeOfLease = db.Column(db.String(50), nullable=False)

    # Relationships
    tenant = db.relationship('Tenant', backref='leases')
    property = db.relationship('Property', backref='leases')

    def validate_dates(self):
        """Validate lease dates"""
        if not self.startDate or not self.endDate:
            raise ValidationError('Start date and end date are required')
        
        if self.startDate >= self.endDate:
            raise ValidationError('End date must be after start date')

        # Validate dates are not in the past
        today = datetime.now().date()
        if self.startDate < today:
            raise ValidationError('Start date cannot be in the past')

    def validate_rent_amount(self):
        """Validate rent amount"""
        if not self.rentAmount:
            raise ValidationError('Rent amount is required')
        
        if not isinstance(self.rentAmount, (int, float)):
            raise ValidationError('Rent amount must be a number')
        
        if self.rentAmount <= 0:
            raise ValidationError('Rent amount must be greater than 0')

    def validate_lease_type(self):
        """Validate lease type"""
        valid_types = ['Fixed', 'Month-to-Month', 'Lease to Own']
        if not self.typeOfLease:
            raise ValidationError('Lease type is required')
        
        if self.typeOfLease not in valid_types:
            raise ValidationError(f'Invalid lease type. Must be one of: {", ".join(valid_types)}')

    def validate_lease(self):
        """Run all validations"""
        self.validate_dates()
        self.validate_rent_amount()
        self.validate_lease_type()

@event.listens_for(Lease, 'before_insert')
@event.listens_for(Lease, 'before_update')
def validate_before_save(mapper, connection, target):
    """Validate lease before saving to database"""
    target.validate_lease() 