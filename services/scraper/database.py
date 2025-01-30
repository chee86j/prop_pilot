import sqlite3
import logging

# Configure logging
logging.basicConfig(filename='database.log', level=logging.INFO, format='%(asctime)s:%(levelname)s:%(message)s')

DATABASE_NAME = 'auction_data.db'

def connect_db():
    """Establish a connection to the SQLite database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        logging.info(f"Connected to the database: {DATABASE_NAME}")
        return conn
    except sqlite3.Error as e:
        logging.error(f"Database connection error: {e}")
        return None

def create_table(conn):
    """Create the auctions table if it doesn't exist, with additional columns."""
    try:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS auctions (
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
        logging.info("Auctions table created or already exists with additional columns.")
    except sqlite3.Error as e:
        logging.error(f"Error creating table: {e}")

def insert_data(conn, data):
    """Insert data into the auctions table, ignoring entries that would cause a unique constraint violation."""
    try:
        cursor = conn.cursor()
        # Using INSERT OR IGNORE to skip any entries that would violate the unique constraint on address
        cursor.executemany('''
            INSERT OR IGNORE INTO auctions (detail_link, sheriff_number, status_date, plaintiff, defendant, address, price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', [(entry['detail_link'], entry['sheriff_number'], entry['status_date'], entry['plaintiff'], entry['defendant'], entry['address'], entry['price']) for entry in data])
        conn.commit()
        logging.info(f"Inserted or ignored {cursor.rowcount} rows into the auctions table.")
    except sqlite3.Error as e:
        logging.error(f"Error inserting data: {e}")

def update_auction_details(conn, detail_link, details):
    """Update an auction entry with additional details."""
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE auctions 
            SET court_case = ?, 
                sale_date = ?,
                description = ?,
                upset_amount = ?,
                attorney = ?,
                last_updated = CURRENT_TIMESTAMP
            WHERE detail_link = ?
        ''', (
            details.get('court_case'),
            details.get('sale_date'),
            details.get('description'),
            details.get('upset_amount'),
            details.get('attorney'),
            detail_link
        ))
        conn.commit()
        logging.info(f"Updated details for auction with detail_link: {detail_link}")
    except sqlite3.Error as e:
        logging.error(f"Error updating auction details: {e}")

def close_db(conn):
    """Close the database connection."""
    if conn:
        conn.close()
        logging.info("Database connection closed.")