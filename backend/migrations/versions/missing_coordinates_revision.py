"""Guard for a historical revision referenced by the existing merge.

The original migration is absent from this repository and its schema changes
and parent are unknown. This placeholder restores the revision graph for
databases already at the merge; it must never silently stand in for applying
or reversing the missing migration.
"""
revision = 'add_coordinates_to_property'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    raise RuntimeError(
        'Historical migration add_coordinates_to_property is missing. '
        'Recover the original migration and inspect the database before upgrading.'
    )


def downgrade():
    raise RuntimeError(
        'Historical migration add_coordinates_to_property is missing. '
        'Recover the original migration before downgrading.'
    )
