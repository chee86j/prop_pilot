# This file is the entry point of the app where it is created and configured.
# It also contains the main route of the app and runs the app in debug mode.

from flask import Flask  # Flask is a Python web framework to build web applications.
from flask_sqlalchemy import SQLAlchemy  # Flask-SQLAlchemy is an extension for Flask that adds support for SQLAlchemy.
from flask_jwt_extended import JWTManager  # Flask-JWT-Extended adds support for JSON Web Tokens.
from flask_cors import CORS  # Flask-CORS handles Cross-Origin Resource Sharing (CORS) for cross-origin requests.
from dotenv import load_dotenv  # python-dotenv reads key-value pairs from a .env file and adds them to the environment.
import os  # os module provides a way of using operating system dependent functionality.
from models import db, User  # Importing the database models.
from routes import api  # Importing the API blueprint from routes.py.

# Load environment variables from the .env file.
load_dotenv()

# Creating an instance of the Flask class.
app = Flask(__name__)

# Configuring the database.
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{os.getenv("DB_USERNAME")}:{os.getenv("DB_PASSWORD")}@localhost/{os.getenv("DB_NAME")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuring JWT.
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Creating instances of SQLAlchemy and JWTManager.
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Enabling CORS for the API routes from the frontend origin.
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Registering the API blueprint with a URL prefix.
app.register_blueprint(api, url_prefix='/api')

# A simple test route.
@app.route('/')
def hello_world():
    return 'Hello, World!'

# Running the app in debug mode if this script is the main program.
if __name__ == '__main__':
    app.run(debug=True)
