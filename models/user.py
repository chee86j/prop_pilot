from werkzeug.security import generate_password_hash, check_password_hash
from .base import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(512), nullable=False)
    last_name = db.Column(db.String(512), nullable=False)
    email = db.Column(db.String(512), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    avatar = db.Column(db.Text, nullable=True) 
    properties = db.relationship('Property', backref='owner', lazy='dynamic')  # User can own multiple properties
    managed_tenants = db.relationship('Tenant', backref='manager', lazy='dynamic')  # User can be a landlord or manager who manages multiple tenants

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password) 