#  Initializes the routes package and combines all route blueprints
 
from flask import Blueprint
from .auth import auth_routes
from .user import user_routes
from .property import property_routes
from .financial import financial_routes
from .tenant import tenant_routes
from .maintenance import maintenance_routes

# Create a Blueprint for the API
api = Blueprint('api', __name__)

# Register all route blueprints
api.register_blueprint(auth_routes)
api.register_blueprint(user_routes)
api.register_blueprint(property_routes)
api.register_blueprint(financial_routes)
api.register_blueprint(tenant_routes)
api.register_blueprint(maintenance_routes) 