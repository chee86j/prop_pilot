from .base import db

class ConstructionDraw(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'))  # Many to one relationship w/Property
    release_date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    bank_account_number = db.Column(db.String(256), nullable=False)
    is_approved = db.Column(db.Boolean, default=False, nullable=False)
    receipts = db.relationship('Receipt', backref='construction_draw', lazy='dynamic')


class Receipt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    construction_draw_id = db.Column(db.Integer, db.ForeignKey('construction_draw.id'))  # Many to one relationship w/ConstructionDraw
    date = db.Column(db.Date, nullable=False)
    vendor = db.Column(db.String(512), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)
    pointofcontact = db.Column(db.String(512), nullable=True)
    ccnumber = db.Column(db.String(4), nullable=True) 