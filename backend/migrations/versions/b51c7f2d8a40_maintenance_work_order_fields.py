"""Add maintenance work order fields and preserve existing records.

Revision ID: b51c7f2d8a40
Revises: 9de37564d2d6
"""
from alembic import op
import sqlalchemy as sa

revision = 'b51c7f2d8a40'
down_revision = '9de37564d2d6'
branch_labels = None
depends_on = None


def upgrade():
    connection = op.get_bind()
    unexpected = connection.execute(sa.text(
        "SELECT DISTINCT status FROM property_maintenance_request "
        "WHERE status IS NULL OR status NOT IN "
        "('pending', 'in_progress', 'completed', 'cancelled')"
    )).scalars().all()
    if unexpected:
        raise RuntimeError(
            f'Unexpected maintenance statuses {unexpected!r}; resolve them before migrating.'
        )

    op.add_column('property_maintenance_request', sa.Column('title', sa.String(160)))
    op.add_column('property_maintenance_request', sa.Column(
        'priority', sa.String(16), nullable=False, server_default='normal'
    ))
    op.add_column('property_maintenance_request', sa.Column('contractorName', sa.String(160)))
    op.add_column('property_maintenance_request', sa.Column('contractorContact', sa.String(255)))
    op.add_column('property_maintenance_request', sa.Column('targetDate', sa.Date()))
    op.add_column('property_maintenance_request', sa.Column('estimatedCost', sa.Numeric(12, 2)))
    op.add_column('property_maintenance_request', sa.Column('actualCost', sa.Numeric(12, 2)))
    op.add_column('property_maintenance_request', sa.Column('notes', sa.Text()))
    op.add_column('property_maintenance_request', sa.Column('completedAt', sa.DateTime()))
    op.add_column('property_maintenance_request', sa.Column(
        'version', sa.Integer(), nullable=False, server_default='1'
    ))

    connection.execute(sa.text(
        "UPDATE property_maintenance_request "
        "SET title = 'Maintenance request #' || CAST(id AS VARCHAR)"
    ))
    connection.execute(sa.text(
        "UPDATE property_maintenance_request SET status = 'open' WHERE status = 'pending'"
    ))

    with op.batch_alter_table('property_maintenance_request') as batch:
        batch.alter_column('tenantId', existing_type=sa.Integer(), nullable=True)
        batch.alter_column('title', existing_type=sa.String(160), nullable=False)
        batch.alter_column('status', existing_type=sa.String(100), nullable=False,
                           server_default='open')
        batch.create_check_constraint(
            'ck_maintenance_status',
            "status IN ('open', 'scheduled', 'in_progress', 'completed', 'cancelled')",
        )
        batch.create_check_constraint(
            'ck_maintenance_priority', "priority IN ('low', 'normal', 'high', 'urgent')"
        )
        batch.create_check_constraint('ck_maintenance_estimated_cost', '"estimatedCost" >= 0')
        batch.create_check_constraint('ck_maintenance_actual_cost', '"actualCost" >= 0')
    op.create_index(
        'ix_maintenance_property_status_target', 'property_maintenance_request',
        ['propertyId', 'status', 'targetDate'],
    )


def downgrade():
    raise RuntimeError(
        'Downgrade would discard maintenance work order data. '
        'Back up and export the data, then perform a deliberate manual rollback.'
    )
