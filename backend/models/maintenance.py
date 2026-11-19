from .base import db

class PropertyMaintenanceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    propertyId = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    tenantId = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)
    title = db.Column(db.String(160), nullable=False, default='Maintenance request')
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(100), nullable=False, default='open', server_default='open')
    priority = db.Column(db.String(16), nullable=False, default='normal', server_default='normal')
    contractorName = db.Column(db.String(160))
    contractorContact = db.Column(db.String(255))
    targetDate = db.Column(db.Date)
    estimatedCost = db.Column(db.Numeric(12, 2))
    actualCost = db.Column(db.Numeric(12, 2))
    notes = db.Column(db.Text)
    timeToCompletion = db.Column(db.Integer)  # Time in hours
    createdAt = db.Column(db.DateTime, default=db.func.current_timestamp())
    updatedAt = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    completedAt = db.Column(db.DateTime)
    version = db.Column(db.Integer, nullable=False, default=1, server_default='1')
    tenant = db.relationship('Tenant', backref='maintenance_requests', lazy=True)

    __table_args__ = (
        db.CheckConstraint(
            "status IN ('open', 'scheduled', 'in_progress', 'completed', 'cancelled')",
            name='ck_maintenance_status',
        ),
        db.CheckConstraint(
            "priority IN ('low', 'normal', 'high', 'urgent')",
            name='ck_maintenance_priority',
        ),
        db.CheckConstraint('"estimatedCost" >= 0', name='ck_maintenance_estimated_cost'),
        db.CheckConstraint('"actualCost" >= 0', name='ck_maintenance_actual_cost'),
        db.Index('ix_maintenance_property_status_target', 'propertyId', 'status', 'targetDate'),
    )
