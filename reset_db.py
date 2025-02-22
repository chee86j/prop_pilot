from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import subprocess
import psycopg2
from dotenv import load_dotenv
from models import db, User, Property, Phase, ConstructionDraw, Receipt, Lease, PropertyMaintenanceRequest, Tenant
from seed import seed_data
import shutil  # Add this import at the top
from sqlalchemy import inspect

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{os.getenv("DB_USERNAME")}:{os.getenv("DB_PASSWORD")}@localhost/{os.getenv("DB_NAME")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    return app, db, migrate

def reset_database():
    # Database connection parameters from .env
    DB_NAME = os.getenv('DB_NAME')
    DB_USERNAME = os.getenv('DB_USERNAME')
    DB_PASSWORD = os.getenv('DB_PASSWORD')

    # Connect to postgres db to drop and recreate the target db
    conn = psycopg2.connect(
        dbname='postgres',
        user=DB_USERNAME,
        password=DB_PASSWORD,
        host='localhost'
    )
    conn.autocommit = True
    cursor = conn.cursor()

    try:
        # Drop existing connections to the database
        cursor.execute(f'''
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '{DB_NAME}'
            AND pid <> pg_backend_pid();
        ''')
        
        # Drop and recreate database
        print(f"Dropping database {DB_NAME}...")
        cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME}")
        print(f"Creating database {DB_NAME}...")
        cursor.execute(f"CREATE DATABASE {DB_NAME}")
        
    finally:
        cursor.close()
        conn.close()

    # Create Flask app and initialize extensions
    app, db, migrate = create_app()

    # Remove migrations folder
    migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
    if os.path.exists(migrations_dir):
        print("Removing migrations folder...")
        try:
            shutil.rmtree(migrations_dir)
        except Exception as e:
            print(f"Error removing migrations folder: {str(e)}")
            # If shutil.rmtree fails, try force delete
            try:
                os.system('rd /s /q "{}"'.format(migrations_dir))
            except Exception as e:
                print(f"Could not remove migrations folder: {str(e)}")
                return

    with app.app_context():
        print("Initializing new migrations...")
        # Initialize migrations folder
        os.system('flask db init')
        
        # Import models to ensure they're registered
        print("Importing models...")
        from models import User, Property, Phase, ConstructionDraw, Receipt, Lease, PropertyMaintenanceRequest, Tenant
        
        print("Creating new migration...")
        # Create migration
        os.system('flask db migrate -m "Initial migration"')
        
        print("Applying migration...")
        # Apply migration
        os.system('flask db upgrade')

        print("Creating all tables...")
        # Create all tables
        db.create_all()

        print("Verifying tables...")
        # Get inspector and list tables
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"Created tables: {', '.join(tables)}")

        print("\nRunning database seeding...")
        try:
            # Create a new connection for seeding
            engine = db.create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
            db.session.remove()
            db.session.close_all()
            
            # Attempt to seed with new connection
            seed_data()
            print("Database seeding completed successfully!")
            
        except Exception as e:
            print(f"Error during seeding: {str(e)}")
            print("\nTrying to reconnect and seed again...")
            try:
                # Wait a moment and try again
                import time
                time.sleep(2)
                
                # Create fresh session
                db.session.remove()
                db.session = db.create_scoped_session()
                
                # Try seeding again
                seed_data()
                print("Database seeding completed successfully on second attempt!")
            except Exception as e2:
                print(f"Second seeding attempt failed: {str(e2)}")
                print("You may need to run the seed.py script separately with: python seed.py")
                return

    print("\nComplete database reset successful!")

if __name__ == "__main__":
    # Set Flask environment variables
    os.environ['FLASK_APP'] = 'app.py'
    os.environ['FLASK_ENV'] = 'development'
    
    reset_database()
