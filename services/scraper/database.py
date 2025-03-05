"""
Database operations for the property auction scraper
"""
import sqlite3
import logging
import os
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

def connect_db() -> Optional[sqlite3.Connection]:
    """
    Connect to the SQLite database
    
    Returns:
        Optional[sqlite3.Connection]: Database connection object or None if connection fails
    """
    try:
        db_path = os.path.join(os.path.dirname(__file__), 'data', 'auctions.db')
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        
        conn = sqlite3.connect(db_path)
        logger.info("✅ Connected to database: %s", db_path)
        return conn
    except Exception as e:
        logger.error("❌ Database connection failed: %s", str(e))
        return None

def create_table(conn: sqlite3.Connection) -> bool:
    """
    Create the auctions table if it doesn't exist
    
    Args:
        conn (sqlite3.Connection): Database connection
        
    Returns:
        bool: True if table was created successfully
    """
    try:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS auctions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                address TEXT NOT NULL,
                price TEXT NOT NULL,
                auction_date TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        logger.info("✅ Auctions table created/verified")
        return True
    except Exception as e:
        logger.error("❌ Failed to create table: %s", str(e))
        return False

def insert_data(conn: sqlite3.Connection, data: List[Dict[str, Any]]) -> bool:
    """
    Insert property data into the database
    
    Args:
        conn (sqlite3.Connection): Database connection
        data (List[Dict[str, Any]]): List of property data dictionaries
        
    Returns:
        bool: True if data was inserted successfully
    """
    try:
        cursor = conn.cursor()
        for item in data:
            cursor.execute('''
                INSERT INTO auctions (address, price, auction_date)
                VALUES (?, ?, ?)
            ''', (item['address'], item['price'], item['auction_date']))
        
        conn.commit()
        logger.info("✅ Inserted %d records into database", len(data))
        return True
    except Exception as e:
        logger.error("❌ Failed to insert data: %s", str(e))
        return False

def close_db(conn: Optional[sqlite3.Connection]) -> None:
    """
    Close the database connection
    
    Args:
        conn (Optional[sqlite3.Connection]): Database connection to close
    """
    if conn:
        try:
            conn.close()
            logger.info("✅ Database connection closed")
        except Exception as e:
            logger.error("❌ Error closing database connection: %s", str(e))