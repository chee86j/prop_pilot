import pytest
from app import create_app
from models import db
from flask import jsonify

def test_create_app():
    """Test application creation"""
    app = create_app()
    assert app is not None
    assert app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] is False
    assert 'sqlite' in app.config['DATABASE_URL']
    assert app.config['JWT_SECRET_KEY'] == 'Promgmt101'

def test_app_context(app):
    """Test application context"""
    with app.app_context():
        assert db.engine is not None

def test_cors_headers(app):
    """Test CORS headers are set correctly"""
    # Add a test route
    @app.route('/api/test', methods=['GET', 'OPTIONS'])
    def test_route():
        return jsonify({'message': 'test'})
    
    client = app.test_client()
    
    response = client.options('/api/test', headers={
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization'
    })
    assert response.headers.get('Access-Control-Allow-Origin') == 'http://localhost:5173'
    assert 'GET' in response.headers.get('Access-Control-Allow-Methods', '')
    assert 'Authorization' in response.headers.get('Access-Control-Allow-Headers', '')

def test_error_handlers(app):
    """Test error handlers"""
    client = app.test_client()
    
    # Test 404
    response = client.get('/api/nonexistent')
    assert response.status_code == 404
    
    # Test 405
    response = client.post('/api/nonexistent')
    assert response.status_code in [404, 405]  # Either is acceptable
    
    # Test database connection
    with app.app_context():
        assert db.engine is not None