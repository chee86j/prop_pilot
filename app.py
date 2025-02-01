import sys  # Add this import at the top with other imports
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
import subprocess
import pandas as pd
import logging

from models import db
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

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Enable CORS for all domains on all routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/run-scraper', methods=['POST'])
def run_scraper():
    try:
        # Get the Downloads folder path
        downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
        os.makedirs(downloads_folder, exist_ok=True)

        # Get the absolute paths
        project_root = os.path.dirname(os.path.abspath(__file__))
        scraper_dir = os.path.join(project_root, 'services', 'scraper')
        scraper_path = os.path.join(scraper_dir, 'main.py')
        
        logging.info(f"Project root: {project_root}")
        logging.info(f"Scraper directory: {scraper_dir}")
        logging.info(f"Scraper path: {scraper_path}")

        if not os.path.exists(scraper_path):
            return jsonify({'error': f'Scraper script not found at: {scraper_path}'}), 500

        # Set up environment variables
        env = os.environ.copy()
        env['AUTO_CONFIRM'] = 'true'
        env['PYTHONPATH'] = os.pathsep.join([
            project_root,
            scraper_dir,
            os.path.join(scraper_dir, 'utils'),
            env.get('PYTHONPATH', '')
        ])

        # Run the scraper from its directory
        result = subprocess.run(
            [sys.executable, 'main.py', downloads_folder],
            env=env,
            capture_output=True,
            text=True,
            cwd=scraper_dir  # Set working directory to scraper folder
        )

        if result.stderr:
            logging.error(f"Scraper stderr: {result.stderr}")
        if result.stdout:
            logging.info(f"Scraper stdout: {result.stdout}")

        # Check for the output file
        csv_file_path = os.path.join(downloads_folder, 'merged_data.csv')
        if os.path.exists(csv_file_path):
            df = pd.read_csv(csv_file_path)
            return jsonify(df.to_dict(orient='records')), 200
        else:
            return jsonify({'error': 'No data file was generated. Check the logs for details.'}), 500

    except subprocess.CalledProcessError as e:
        logging.error(f"Scraper process error: {e.stderr}")
        return jsonify({'error': f"Scraper process error: {e.stderr}"}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

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
