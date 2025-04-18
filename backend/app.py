import sys
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
import subprocess
import pandas as pd
import logging
from pathlib import Path
from datetime import timedelta

from models import db, User, Property, Phase, ConstructionDraw, Receipt, Tenant, Lease, PropertyMaintenanceRequest
from routes import api
from routes.auth import auth_routes
from routes.school_routes import school_bp

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Set the Flask secret key
    app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))
    
    # Configure CORS
    CORS(app, 
         resources={
             r"/*": {  # Changed from /api/* to /* to match all routes
                 "origins": ["http://localhost:5173"],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "expose_headers": ["Content-Type", "Authorization"],
                 "supports_credentials": True,
                 "max_age": 120,
                 "send_wildcard": False
             }
         }
    )
    
    # Configure the Flask app
    if os.getenv('FLASK_ENV') == 'testing':
        database_url = 'sqlite:///:memory:'
    else:
        db_username = os.getenv('DB_USERNAME')
        db_password = os.getenv('DB_PASSWORD')
        db_name = os.getenv('DB_NAME')
        database_url = f'postgresql://{db_username}:{db_password}@localhost/{db_name}'
    
    app.config.update({
        'DATABASE_URL': database_url,
        'SQLALCHEMY_DATABASE_URI': database_url,
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY', 'dev-secret-key'),
        'JWT_ACCESS_TOKEN_EXPIRES': timedelta(hours=1),
        # Enhanced security config (1 hr access token, secure cookies, CSRF protection, HTTP-only cookies, and secure sec
        'JWT_COOKIE_SECURE': True,
        'JWT_COOKIE_CSRF_PROTECT': True,
        'JWT_CSRF_CHECK_FORM': True,
        'SESSION_COOKIE_SECURE': True,
        'SESSION_COOKIE_HTTPONLY': True,
        'SESSION_COOKIE_SAMESITE': 'Lax',
        'PERMANENT_SESSION_LIFETIME': timedelta(hours=1),
        'SESSION_REFRESH_EACH_REQUEST': True
    })
    
    # Initialize extensions with the app
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize Flask-Migrate
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(auth_routes, url_prefix='/api')
    app.register_blueprint(school_bp, url_prefix='/api')
    
    # Create database tables
    with app.app_context():
        try:
            # Test database connection
            db.engine.connect()
            print("[SUCCESS] Database connection successful!")
            
            # Create tables
            db.create_all()
            print("[SUCCESS] Database tables created successfully!")
            
        except Exception as e:
            print(f"[ERROR] Database connection failed: {e}")
    
    # Add security headers to all responses
    @app.after_request
    def after_request(response):
        # Security headers
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Content-Security-Policy'] = "default-src 'self' https://accounts.google.com https://www.googleapis.com; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        return response
    
    return app

# Create the app instance for running directly
app = create_app()

if __name__ == '__main__':
    # Check for required environment variables
    required_vars = ['SCHOOL_DATA_API_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f'❌ Missing required environment variables: {", ".join(missing_vars)}')
        raise EnvironmentError(f'Missing required environment variables: {", ".join(missing_vars)}')
    
    logger.info('🚀 Starting Property Pilot API server...')
    app.run(debug=True)
