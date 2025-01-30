import sqlite3
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_database():
    """Set up or migrate the database schema."""
    try:
        conn = sqlite3.connect('auction_data.db')
        cursor = conn.cursor()

        # Drop existing table to ensure clean migration
        cursor.execute("DROP TABLE IF EXISTS auctions")
        
        # Create table with all required columns
        cursor.execute('''
        CREATE TABLE auctions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            detail_link TEXT,
            sheriff_number TEXT,
            status_date TEXT,
            plaintiff TEXT,
            defendant TEXT,
            address TEXT UNIQUE,
            price INTEGER,
            court_case TEXT,
            sale_date TEXT,
            description TEXT,
            upset_amount TEXT,
            attorney TEXT,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        conn.commit()
        logger.info("Database migration completed successfully")
        
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        raise
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    migrate_database()
