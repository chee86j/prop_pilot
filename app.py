from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

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

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Enable CORS for all domains on all routes
CORS(app)

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
