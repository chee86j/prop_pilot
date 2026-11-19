"""Exercise the maintenance migration against a representative old schema."""
import importlib.util
from pathlib import Path

import pytest
import sqlalchemy as sa
from alembic.migration import MigrationContext
from alembic.operations import Operations
from alembic.script import ScriptDirectory
from alembic.config import Config
from alembic import command
from flask import Flask
from flask_migrate import Migrate
from models import db


MIGRATIONS = Path(__file__).resolve().parents[2] / 'migrations'
REVISION = MIGRATIONS / 'versions' / 'b51c7f2d8a40_maintenance_work_order_fields.py'


def load_revision():
    spec = importlib.util.spec_from_file_location('maintenance_work_order_revision', REVISION)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_old_schema(engine):
    metadata = sa.MetaData()
    sa.Table('property', metadata, sa.Column('id', sa.Integer, primary_key=True))
    sa.Table('tenant', metadata, sa.Column('id', sa.Integer, primary_key=True))
    sa.Table(
        'property_maintenance_request', metadata,
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('propertyId', sa.Integer, sa.ForeignKey('property.id'), nullable=False),
        sa.Column('tenantId', sa.Integer, sa.ForeignKey('tenant.id'), nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('status', sa.String(100)),
        sa.Column('timeToCompletion', sa.Integer),
        sa.Column('createdAt', sa.DateTime),
        sa.Column('updatedAt', sa.DateTime),
    )
    metadata.create_all(engine)


@pytest.fixture
def old_database():
    engine = sa.create_engine('sqlite:///:memory:')
    make_old_schema(engine)
    yield engine
    engine.dispose()


def test_migration_preserves_records_and_adds_work_order_fields(old_database, monkeypatch):
    revision = load_revision()
    with old_database.begin() as connection:
        connection.execute(sa.text('INSERT INTO property (id) VALUES (1)'))
        connection.execute(sa.text('INSERT INTO tenant (id) VALUES (2)'))
        connection.execute(sa.text(
            'INSERT INTO property_maintenance_request '
            '(id, "propertyId", "tenantId", description, status, "timeToCompletion", "createdAt", "updatedAt") '
            "VALUES (:id, 1, 2, :description, :status, 24, '2025-01-02 12:00:00', '2025-01-03 12:00:00')"
        ), [
            {'id': index, 'description': f'Issue {index}', 'status': status}
            for index, status in enumerate(('pending', 'in_progress', 'completed', 'cancelled'), 1)
        ])
        monkeypatch.setattr(revision, 'op', Operations(MigrationContext.configure(connection)))
        revision.upgrade()

        rows = connection.execute(sa.text(
            'SELECT * FROM property_maintenance_request ORDER BY id'
        )).mappings().all()
        assert [row['status'] for row in rows] == ['open', 'in_progress', 'completed', 'cancelled']
        for index, row in enumerate(rows, 1):
            assert (row['id'], row['propertyId'], row['tenantId']) == (index, 1, 2)
            assert row['description'] == f'Issue {index}'
            assert row['title'] == f'Maintenance request #{index}'
            assert row['priority'] == 'normal'
            assert row['version'] == 1
            assert row['timeToCompletion'] == 24
            assert str(row['createdAt']).startswith('2025-01-02 12:00:00')
            assert str(row['updatedAt']).startswith('2025-01-03 12:00:00')
            assert row['completedAt'] is None
            assert row['estimatedCost'] is None and row['actualCost'] is None

        connection.execute(sa.text(
            "INSERT INTO property_maintenance_request (id, \"propertyId\", \"tenantId\", title, description) "
            "VALUES (5, 1, NULL, 'Vacant property', 'Repair')"
        ))
        assert connection.execute(sa.text(
            'SELECT status FROM property_maintenance_request WHERE id = 5'
        )).scalar_one() == 'open'
        for statement in (
            "UPDATE property_maintenance_request SET status = 'unknown' WHERE id = 5",
            "UPDATE property_maintenance_request SET priority = 'unknown' WHERE id = 5",
            'UPDATE property_maintenance_request SET "actualCost" = -1 WHERE id = 5',
            'UPDATE property_maintenance_request SET "estimatedCost" = -1 WHERE id = 5',
        ):
            with pytest.raises(sa.exc.IntegrityError):
                with connection.begin_nested():
                    connection.execute(sa.text(statement))

    with old_database.connect() as connection:
        columns = {column['name']: column for column in sa.inspect(connection).get_columns('property_maintenance_request')}
        assert columns['tenantId']['nullable'] is True
        assert columns['title']['nullable'] is False
        assert 'ix_maintenance_property_status_target' in {
            index['name'] for index in sa.inspect(connection).get_indexes('property_maintenance_request')
        }


@pytest.mark.parametrize('status', ['unexpected', None])
def test_migration_rejects_unknown_status_before_schema_changes(old_database, monkeypatch, status):
    revision = load_revision()
    with old_database.begin() as connection:
        connection.execute(sa.text(
            'INSERT INTO property_maintenance_request '
            '(id, "propertyId", "tenantId", description, status) VALUES (1, 1, 2, :description, :status)'
        ), {'description': 'Unresolved', 'status': status})
        monkeypatch.setattr(revision, 'op', Operations(MigrationContext.configure(connection)))
        with pytest.raises(RuntimeError, match='Unexpected maintenance statuses'):
            revision.upgrade()
        assert 'title' not in {
            column['name'] for column in sa.inspect(connection).get_columns('property_maintenance_request')
        }
        assert connection.execute(sa.text('SELECT status FROM property_maintenance_request')).scalar_one() == status


def test_migration_graph_has_one_head_and_missing_revision_is_guarded():
    script = ScriptDirectory(str(MIGRATIONS))
    assert script.get_current_head() == 'b51c7f2d8a40'
    missing = script.get_revision('add_coordinates_to_property').module
    with pytest.raises(RuntimeError, match='Historical migration .* is missing'):
        missing.upgrade()
    with pytest.raises(RuntimeError, match='Historical migration .* is missing'):
        missing.downgrade()


def test_alembic_upgrades_an_existing_merge_revision(tmp_path):
    database_file = tmp_path / 'old.sqlite'
    engine = sa.create_engine(f'sqlite:///{database_file.as_posix()}')
    make_old_schema(engine)
    with engine.begin() as connection:
        connection.execute(sa.text(
            'INSERT INTO property_maintenance_request '
            '(id, "propertyId", "tenantId", description, status) VALUES (1, 1, 2, :description, :status)'
        ), {'description': 'Legacy repair', 'status': 'pending'})
        connection.execute(sa.text('CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL PRIMARY KEY)'))
        connection.execute(sa.text("INSERT INTO alembic_version VALUES ('9de37564d2d6')"))
    engine.dispose()

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_file.as_posix()}'
    db.init_app(app)
    Migrate(app, db)
    config = Config(str(MIGRATIONS / 'alembic.ini'))
    config.set_main_option('script_location', str(MIGRATIONS))
    with app.app_context():
        command.upgrade(config, 'head')
        with db.engine.connect() as connection:
            assert connection.execute(sa.text('SELECT version_num FROM alembic_version')).scalar_one() == 'b51c7f2d8a40'
            row = connection.execute(sa.text(
                'SELECT title, status, description FROM property_maintenance_request'
            )).one()
            assert row == ('Maintenance request #1', 'open', 'Legacy repair')
        db.engine.dispose()
