from app import app, db
import os

def reset_database():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        
        # Remove migrations folder if it exists
        migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file != '__pycache__':
                    file_path = os.path.join(migrations_dir, file)
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                    else:
                        for subfile in os.listdir(file_path):
                            os.unlink(os.path.join(file_path, subfile))
                        os.rmdir(file_path)
            os.rmdir(migrations_dir)
        
        # Create all tables
        db.create_all()
        print("Database reset successful!")

if __name__ == "__main__":
    reset_database()
