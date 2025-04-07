import pytest
from app import create_app
import os

def test_create_app_development():
    """Test app creation in development environment"""
    os.environ['FLASK_ENV'] = 'development'
    app = create_app()
    
    assert app is not None
    assert app.config['SQLALCHEMY_DATABASE_URI'].startswith('postgresql://')
    assert not app.config['SQLALCHEMY_TRACK_MODIFICATIONS']
    assert app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds() == 3600  # 1 hour

def test_create_app_testing():
    """Test app creation in testing environment"""
    os.environ['FLASK_ENV'] = 'testing'
    app = create_app()
    
    assert app is not None
    assert app.config['SQLALCHEMY_DATABASE_URI'] == 'sqlite:///:memory:'
    assert not app.config['SQLALCHEMY_TRACK_MODIFICATIONS']

def test_blueprint_registration():
    """Test that blueprints are properly registered"""
    app = create_app()
    
    # Check if the API blueprint is registered
    assert any(blueprint.name == 'api' for blueprint in app.blueprints.values())
    assert any(rule.rule.startswith('/api') for rule in app.url_map.iter_rules()) 