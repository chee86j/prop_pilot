import sys  # Add this import at the top with other imports
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

from models import db, User, Property, Phase, ConstructionDraw, Receipt, Tenant, Lease, PropertyMaintenanceRequest
from routes import api

# Load environment variables from .env file
load_dotenv()

# Create an instance of Flask
app = Flask(__name__)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{os.getenv("DB_USERNAME")}:{os.getenv("DB_PASSWORD")}@localhost/{os.getenv("DB_NAME")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Test database connection using a context manager
def test_db_connection():
    try:
        with app.app_context():
            db.engine.connect()
            print("✅ Database connection successful!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        raise e

# Test connection immediately
test_db_connection()

# Create tables within app context if they don't exist
with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Update CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],  # Specify exact origin to avoid CSRF attacks
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/api/run-scraper', methods=['POST'])
@jwt_required()  # Add JWT requirement
def run_scraper():
    try:
        print("✅ Starting scraper process...")  # Beginning of process
        # Create downloads directory in the scraper folder
        scraper_dir = Path(__file__).parent / 'services' / 'scraper'
        downloads_dir = scraper_dir / 'downloads'
        downloads_dir.mkdir(parents=True, exist_ok=True)

        # Set up environment
        env = os.environ.copy()
        env['PYTHONPATH'] = str(scraper_dir.parent)

        # Run the scraper
        process = subprocess.Popen(
            [sys.executable, str(scraper_dir / 'main.py')],
            env=env,
            cwd=str(scraper_dir),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate()
        print(f"✅ Scraper stdout: {stdout}")  # Actual scraper output
        
        if process.returncode != 0:
            print(f"❌ Scraper failed with error: {stderr}")  # Error cases
            logging.error(f"❌ Scraper failed: {stderr}")
            return jsonify({'error': '❌ Scraper failed', 'details': stderr}), 500

        # Check for output file
        output_file = downloads_dir / 'merged_data.csv'
        if output_file.exists():
            print("✅ Successfully generated scraped data file")  # Success case
            df = pd.read_csv(output_file)
            return jsonify({
                'message': '✅ Scraper completed successfully',
                'data': df.to_dict(orient='records')
            }), 200
        
        print("❌ No data file was generated")  # Failure case
        return jsonify({'error': '❌ No data file was generated'}), 500

    except Exception as e:
        print(f"❌ Error in scraper: {str(e)}")  # Console log
        logging.error(f"❌ Error running scraper: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/scraped-properties', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_scraped_properties():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        # Get the project root directory
        project_root = os.path.dirname(os.path.abspath(__file__))
        downloads_folder = os.path.join(project_root, 'services', 'scraper', 'downloads')
        os.makedirs(downloads_folder, exist_ok=True)  # Create folder if it doesn't exist
        
        csv_path = os.path.join(downloads_folder, 'merged_data.csv')
        
        if not os.path.exists(csv_path):
            return jsonify({'message': 'No scraped data available. Please run the scraper first.'}), 404
            
        # Read the CSV file
        df = pd.read_csv(csv_path)
        properties = df.to_dict('records')
        return jsonify(properties), 200
        
    except Exception as e:
        logging.error(f"Error retrieving scraped properties: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Register API blueprint

app.register_blueprint(api, url_prefix='/api')

# This block can be removed for production. It's for testing purposes.
# Run setup code to rebuild the database based on the models
# with app.app_context():
#     db.drop_all()
#     db.create_all()
    # Drop all existing tables
    # Create new tables based on models

# Run the app in debug mode
if __name__ == '__main__':
    app.run(debug=True)
