from werkzeug.security import generate_password_hash, check_password_hash
from .base import db
import re

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(512), nullable=False)
    last_name = db.Column(db.String(512), nullable=False)
    email = db.Column(db.String(512), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    avatar = db.Column(db.Text, nullable=True) 
    managed_tenants = db.relationship('Tenant', backref='manager', lazy='dynamic')  # User can be a landlord or manager who manages multiple tenants

    def validate_password(self, password):
        """
        Validate password meets minimum requirements:
        - At least 4 characters long
        """
        if len(password) < 4:
            raise ValueError('Password must be at least 4 characters long')

    def set_password(self, password):
        """Set password after validation"""
        self.validate_password(password)
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password) 