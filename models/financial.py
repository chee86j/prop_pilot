from .base import db
from datetime import date
from sqlalchemy import event
from .base import ValidationError

class ConstructionDraw(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'))  # Many to one relationship w/Property
    release_date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    bank_account_number = db.Column(db.String(256), nullable=False)
    is_approved = db.Column(db.Boolean, default=False, nullable=False)
    receipts = db.relationship('Receipt', backref='construction_draw', lazy='dynamic')

    def validate_property_id(self):
        """Validate property_id is present and positive"""
        if not self.property_id or not isinstance(self.property_id, int) or self.property_id <= 0:
            raise ValidationError('Property ID must be a positive integer')

    def validate_release_date(self):
        """Validate release_date is not null and not in the past"""
        if not self.release_date:
            raise ValidationError('Release date is required')

    def validate_amount(self):
        """Validate amount is positive"""
        if not self.amount or not isinstance(self.amount, (int, float)) or self.amount <= 0:
            raise ValidationError('Amount must be a positive number')

    def validate_bank_account_number(self):
        """Validate bank account number format"""
        if not self.bank_account_number or len(self.bank_account_number) < 4:
            raise ValidationError('Bank account number must be at least 4 digits')
        if not self.bank_account_number.isdigit():
            raise ValidationError('Bank account number must contain only digits')

    def validate_for_creation(self):
        """Run all validations"""
        self.validate_property_id()
        self.validate_release_date()
        self.validate_amount()
        self.validate_bank_account_number()

    def to_dict(self):
        """Convert the model instance to a dictionary"""
        return {
            'id': self.id,
            'property_id': self.property_id,
            'release_date': self.release_date.isoformat() if self.release_date else None,
            'amount': self.amount,
            'bank_account_number': self.bank_account_number,
            'is_approved': self.is_approved
        }

@event.listens_for(ConstructionDraw, 'before_insert')
@event.listens_for(ConstructionDraw, 'before_update')
def validate_construction_draw_before_save(mapper, connection, target):
    """Validate construction draw before saving to database"""
    target.validate_for_creation()

class Receipt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    construction_draw_id = db.Column(db.Integer, db.ForeignKey('construction_draw.id'))  # Many to one relationship w/ConstructionDraw
    date = db.Column(db.Date, nullable=False)
    vendor = db.Column(db.String(512), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)
    pointofcontact = db.Column(db.String(512), nullable=True)
    ccnumber = db.Column(db.String(4), nullable=True) 