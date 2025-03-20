import sys
import os
import logging
import pandas as pd
import json
from .scraper import parse_page_selenium
from .database import connect_db, create_table, insert_data, close_db
from .merge_csv import merge_csv_files
from .utils.logger import setup_logger
from .utils.exceptions import ScraperException, DatabaseException, NetworkException
import traceback

logger = setup_logger(__name__, 'logs/scraper.log')

# Define county URLs and IDs
COUNTY_URLS = {
    'Morris': {'id': 9, 'url': 'https://salesweb.civilview.com/Sales/SalesSearch?countyId=9'},
    'Bergen': {'id': 7, 'url': 'https://salesweb.civilview.com/Sales/SalesSearch?countyId=7'},
    'Essex': {'id': 2, 'url': 'https://salesweb.civilview.com/Sales/SalesSearch?countyId=2'},
    'Union': {'id': 15, 'url': 'https://salesweb.civilview.com/Sales/SalesSearch?countyId=15'},
    'Hudson': {'id': 10, 'url': 'https://salesweb.civilview.com/Sales/SalesSearch?countyId=10'}
}

def format_zillow_url(address):
    """Convert the address to a Zillow URL format."""
    try:
        # Remove any unwanted characters and format the address
        formatted_address = address.strip()
        formatted_address = formatted_address.replace(" ", "-").replace(",", "").replace(".", "")
        formatted_address = formatted_address.replace("--", "-")  # Replace double dashes
        formatted_address = formatted_address.lower()
        zillow_url = f"https://www.zillow.com/homes/{formatted_address}_rb/"
        return zillow_url
    except Exception as e:
        logging.error(f"Error formatting Zillow URL for {address}: {e}")
        return None

def format_for_frontend(data):
    """Format scraped data for frontend PropertyDetails component."""
    formatted_data = {
        'propertyName': data.get('address', ''),
        'address': data.get('address', ''),
        'city': '',  # Would need to parse from address
        'state': '',  # Would need to parse from address
        'zipCode': '',  # Would need to parse from address
        'county': '',  # Would need to parse from address
        'purchaseCost': data.get('price', 0),
        'arvSalePrice': data.get('arv', 0),  # If available from Zillow
        'propertyType': data.get('property_type', ''),
        'bedroomsDescription': data.get('bed_bath_sqft', '').split('bd')[0].strip() if data.get('bed_bath_sqft') else '',
        'bathroomsDescription': data.get('bed_bath_sqft', '').split('ba')[0].split('bd')[1].strip() if data.get('bed_bath_sqft') else '',
        'yearlyPropertyTaxes': sum(float(item['property_taxes'].replace('$', '').replace(',', '')) 
                                 for item in data.get('tax_history', [])[:1]) if data.get('tax_history') else 0,
    }
    
    # Add Zillow data if available
    if 'zillow_details' in data:
        zestimate = data['zillow_details'].get('zestimate', '').replace('$', '').replace(',', '')
        formatted_data.update({
            'zestimate': float(zestimate) if zestimate.replace('.', '').isdigit() else 0
        })

    return formatted_data

def export_formatted_data(formatted_data, output_file):
    """Export formatted data as JSON for frontend consumption."""
    try:
        with open(output_file, 'w') as f:
            json.dump(formatted_data, f, indent=2)
        logging.info(f"Frontend-formatted data exported to {output_file}")
    except Exception as e:
        logging.error(f"Error exporting frontend data: {e}")

def main(county='Morris') -> bool:
    """
    Main scraper execution function
    
    Args:
        county (str): The county to scrape data from. Defaults to 'Morris'.
        
    Returns:
        bool: True if scraping completed successfully, False otherwise
    """
    try:
        # Ensure county is valid
        if county not in COUNTY_URLS:
            logger.error(f"❌ Invalid county: {county}")
            return False
            
        # Get county URL
        url = COUNTY_URLS[county]['url']
        county_id = COUNTY_URLS[county]['id']
        
        # Ensure downloads folder exists
        downloads_folder = os.path.join(os.path.dirname(__file__), 'downloads')
        os.makedirs(downloads_folder, exist_ok=True)
        
        # Step 1: Scrape auction data
        logger.info(f"🔄 Starting page scrape for {county} County: {url}")
        
        data = parse_page_selenium(url)
        if not data:
            raise ScraperException(f"No data returned from scraping {county} County")

        # Add county information to each record
        for item in data:
            item['county'] = county

        # Step 2: Database operations
        logger.info("💾 Initializing database connection")
        conn = connect_db()
        if not conn:
            raise DatabaseException("Failed to establish database connection")

        try:
            create_table(conn)
            insert_data(conn, data)
            
            # Step 3: Export data processing
            logger.info("📊 Processing and exporting data")
            
            exported_csv = os.path.join(downloads_folder, "exported_data.csv")
            df = pd.DataFrame(data)
            df.to_csv(exported_csv, index=False)
            logger.info("✅ Data exported to %s", exported_csv)

            # Step 4: Generate Zillow URLs
            logger.info("🏠 Generating Zillow URLs")
            zillow_csv = os.path.join(downloads_folder, "exported_zillow_urls.csv")
            results = []
            for address in df['address']:
                try:
                    zillow_url = format_zillow_url(address)
                    if zillow_url:
                        results.append({'address': address, 'Zillow URL': zillow_url})
                except Exception as e:
                    logger.warning("⚠️ Failed to generate Zillow URL for address %s: %s", address, e)

            pd.DataFrame(results).to_csv(zillow_csv, index=False)
            logger.info("✅ Zillow URLs exported to %s", zillow_csv)

            # Step 5: Merge files
            logger.info("🔄 Merging data files")
            output_file = os.path.join(downloads_folder, 'merged_data.csv')
            merge_csv_files(
                address_file=exported_csv,
                zillow_url_file=zillow_csv,
                output_file=output_file
            )
            
            # Also generate a combined merged_data.csv file for backward compatibility
            combined_output_file = os.path.join(downloads_folder, 'merged_data.csv')
            df.to_csv(combined_output_file, index=False)
            
            logger.info("✅ Files merged successfully to %s", output_file)

            return True

        except Exception as e:
            logger.error("❌ Database operation failed: %s\n%s", str(e), traceback.format_exc())
            raise DatabaseException(f"Database operation failed: {str(e)}")
            
        finally:
            close_db(conn)
            logger.info("🔌 Database connection closed")

    except ScraperException as e:
        logger.error("❌ Scraping failed: %s\n%s", str(e), traceback.format_exc())
        return False
    except DatabaseException as e:
        logger.error("❌ Database error: %s\n%s", str(e), traceback.format_exc())
        return False
    except Exception as e:
        logger.error("❌ Unexpected error: %s\n%s", str(e), traceback.format_exc())
        return False

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Run the foreclosure scraper')
    parser.add_argument('--county', type=str, default='Morris', 
                        choices=list(COUNTY_URLS.keys()),
                        help='County to scrape data from')
    args = parser.parse_args()
    
    success = main(args.county)
    if success:
        logger.info(f"✅ Script completed successfully for {args.county} County")
        sys.exit(0)
    else:
        logger.error(f"❌ Script failed to complete for {args.county} County")
        sys.exit(1)
        
# In order to start the scraper you will need to run the following command:
# 1. `python main.py --county Morris`
# 2. `viewer.py` to view the data in the frontend and add extra data from the Details
#    links that you will have to manually click on.