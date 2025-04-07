from .base import db

class PropertyMaintenanceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    propertyId = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    tenantId = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(100), default='pending')
    timeToCompletion = db.Column(db.Integer)  # Time in hours
    createdAt = db.Column(db.DateTime, default=db.func.current_timestamp())
    updatedAt = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    tenant = db.relationship('Tenant', backref='maintenance_requests', lazy=True)  # Many to one relationship w/Tenant 