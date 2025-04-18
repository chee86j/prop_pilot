"""Adjusted Property Model

Revision ID: 9dea2a476815
Revises: 
Create Date: 2025-03-20 16:29:20.483725

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9dea2a476815'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('property', schema=None) as batch_op:
        batch_op.alter_column('waterAccountNumber',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               type_=sa.String(length=32),
               existing_nullable=True)
        batch_op.alter_column('electricAccountNumber',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               type_=sa.String(length=32),
               existing_nullable=True)
        batch_op.alter_column('gasOrOilAccountNumber',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               type_=sa.String(length=32),
               existing_nullable=True)
        batch_op.alter_column('sewerAccountNumber',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               type_=sa.String(length=32),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('property', schema=None) as batch_op:
        batch_op.alter_column('sewerAccountNumber',
               existing_type=sa.String(length=32),
               type_=sa.DOUBLE_PRECISION(precision=53),
               existing_nullable=True)
        batch_op.alter_column('gasOrOilAccountNumber',
               existing_type=sa.String(length=32),
               type_=sa.DOUBLE_PRECISION(precision=53),
               existing_nullable=True)
        batch_op.alter_column('electricAccountNumber',
               existing_type=sa.String(length=32),
               type_=sa.DOUBLE_PRECISION(precision=53),
               existing_nullable=True)
        batch_op.alter_column('waterAccountNumber',
               existing_type=sa.String(length=32),
               type_=sa.DOUBLE_PRECISION(precision=53),
               existing_nullable=True)

    # ### end Alembic commands ###
