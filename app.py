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

# Load environment variables from .env file
load_dotenv()

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, 
         resources={
             r"/api/*": {
                 "origins": ["http://localhost:5173"],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "expose_headers": ["Content-Type", "Authorization"],
                 "supports_credentials": True,
                 "max_age": 120,
                 "send_wildcard": False
             }
         },
         allow_headers=["Content-Type", "Authorization"],
         expose_headers=["Content-Type", "Authorization"],
         supports_credentials=True
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
        'JWT_ACCESS_TOKEN_EXPIRES': timedelta(hours=1)
    })
    
    # Initialize extensions with the app
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize Flask-Migrate
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(auth_routes, url_prefix='/api')
    
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
            
    # Add OPTIONS method handler for all routes
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    return app

# Create the app instance for running directly
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
