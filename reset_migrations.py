import os
import logging
from typing import List, Optional
import django
from django.conf import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_django() -> None:
    """Initialize Django settings"""
    logger.info('🔧 Setting up Django environment...')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
    django.setup()
    logger.info('✅ Django environment setup complete')

def get_migration_files(app_name: str) -> List[str]:
    """Get all migration files for a given app"""
    migrations_dir = os.path.join(app_name, 'migrations')
    if not os.path.exists(migrations_dir):
        logger.warning(f'⚠️ No migrations directory found for {app_name}')
        return []
    
    return [f for f in os.listdir(migrations_dir) 
            if f.endswith('.py') and f != '__init__.py']

def remove_migration_files(app_name: str) -> None:
    """Remove all migration files except __init__.py"""
    migrations_dir = os.path.join(app_name, 'migrations')
    migration_files = get_migration_files(app_name)
    
    logger.info(f'🗑️ Removing migration files for {app_name}...')
    for file_name in migration_files:
        file_path = os.path.join(migrations_dir, file_name)
        try:
            os.remove(file_path)
            logger.debug(f'🗑️ {file_path = } removed')
        except Exception as e:
            logger.error(f'❌ Failed to remove {file_path}: {str(e)}')
    logger.info(f'✅ Migration files removed for {app_name}')

def reset_migrations(app_names: Optional[List[str]] = None) -> None:
    """Reset migrations for specified apps or all apps if none specified"""
    setup_django()
    
    if app_names is None:
        app_names = [app for app in settings.INSTALLED_APPS 
                    if not app.startswith('django.') and not app.startswith('rest_framework')]
    
    logger.info('🔄 Starting migration reset process...')
    
    for app_name in app_names:
        logger.info(f'🎯 Processing {app_name}...')
        remove_migration_files(app_name)
    
    logger.info('''
    ✅ Migration files have been removed. Next steps:
    
    1. Delete your database or remove migration records:
       - For SQLite: Delete the db.sqlite3 file
       - For PostgreSQL: Drop and recreate the database
       
    2. Run these commands:
       python manage.py makemigrations
       python manage.py migrate
    ''')

if __name__ == '__main__':
    # You can specify apps to reset or leave empty for all apps
    reset_migrations()  # or reset_migrations(['app1', 'app2']) 