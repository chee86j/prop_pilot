"""empty message

Revision ID: 9de37564d2d6
Revises: 08d64fe80a4a, add_coordinates_to_property
Create Date: 2025-04-17 23:44:42.951192

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9de37564d2d6'
down_revision = ('08d64fe80a4a', 'add_coordinates_to_property')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
