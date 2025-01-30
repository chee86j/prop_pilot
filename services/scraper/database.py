import sqlite3
import logging

# Configure logging
logging.basicConfig(filename='database.log', level=logging.INFO, format='%(asctime)s:%(levelname)s:%(message)s')

DATABASE_NAME = 'auction_data.db'

def migrate_database(conn):
    """Migrate the database to include new columns."""
    try:
        cursor = conn.cursor()
        
        # Get existing columns
        cursor.execute("PRAGMA table_info(auctions)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add new columns if they don't exist
        new_columns = {
            'court_case': 'TEXT',
            'sale_date': 'TEXT',
            'description': 'TEXT',
            'upset_amount': 'TEXT',
            'attorney': 'TEXT',
            'last_updated': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        }
        
        for column_name, column_type in new_columns.items():
            if column_name not in columns:
                try:
                    cursor.execute(f"ALTER TABLE auctions ADD COLUMN {column_name} {column_type}")
                    logging.info(f"Added new column: {column_name}")
                except sqlite3.OperationalError as e:
                    logging.warning(f"Column {column_name} already exists or error: {e}")
        
        conn.commit()
        logging.info("Database migration completed successfully")
    except sqlite3.Error as e:
        logging.error(f"Error during database migration: {e}")

def connect_db():
    """Establish a connection to the SQLite database and ensure schema is up to date."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        # Create table if it doesn't exist
        create_table(conn)
        # Migrate database to add new columns
        migrate_database(conn)
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
        
        # Sync changes to CSV
        sync_db_to_csv(conn)
        
        logging.info(f"Updated details for auction with detail_link: {detail_link}")
    except sqlite3.Error as e:
        logging.error(f"Error updating auction details: {e}")

def sync_db_to_csv(conn, csv_file='merged_data.csv'):
    """Synchronize database contents to CSV file."""
    try:
        cursor = conn.cursor()
        # Get all data including the new columns
        cursor.execute('''
            SELECT 
                detail_link,
                sheriff_number,
                status_date,
                plaintiff,
                defendant,
                address,
                price,
                court_case,
                sale_date,
                description,
                upset_amount,
                attorney
            FROM auctions
        ''')
        
        # Read existing CSV to get Zillow URLs
        import pandas as pd
        existing_df = pd.read_csv(csv_file)
        zillow_urls = existing_df.set_index('address')['Zillow URL'].to_dict()
        
        # Convert database data to DataFrame
        columns = [description[0] for description in cursor.description]
        data = cursor.fetchall()
        df = pd.DataFrame(data, columns=columns)
        
        # Add Zillow URLs back to the data
        df['Zillow URL'] = df['address'].map(zillow_urls)
        
        # Save to CSV
        df.to_csv(csv_file, index=False)
        logging.info(f"Database synchronized to {csv_file}")
    except Exception as e:
        logging.error(f"Error synchronizing database to CSV: {e}")
        raise

def close_db(conn):
    """Close the database connection."""
    if conn:
        conn.close()
        logging.info("Database connection closed.")