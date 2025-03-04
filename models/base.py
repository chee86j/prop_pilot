from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.declarative import declarative_base

# Initialize SQLAlchemy with no settings
db = SQLAlchemy()

Base = declarative_base()

class ValidationError(Exception):
    """Custom validation error for model validation."""
    pass 