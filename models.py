from flask_login import UserMixin
from werkzeug.security import generate_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    avatar = db.Column(db.Text)
    properties = db.relationship('Property', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

class Property(db.Model):
    __tablename__ = 'properties'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    propertyName = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    purchaseCost = db.Column(db.Float)
    totalRehabCost = db.Column(db.Float)
    arvSalePrice = db.Column(db.Float)
    city = db.Column(db.String(100)) 