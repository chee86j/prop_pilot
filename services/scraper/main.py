import sys
import os
import logging
from scraper import parse_page_selenium
from database import connect_db, create_table, insert_data, close_db
from utils.export_to_csv import export_data_to_csv  # Importing the correct function from utils
import pandas as pd
from merge_csv import merge_csv_files  # Import the merge_csv functionality
import json

# Configure logging 
logging.basicConfig(level=logging.INFO, format='%(asctime)s:%(levelname)s:%(message)s')

def format_zillow_url(address):
    """Convert the address to a Zillow URL format."""
    try:
        formatted_address = address.replace(" ", "-").replace(",", "")
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

def main():
    auto_confirm = os.environ.get('AUTO_CONFIRM', '').lower() == 'true'
    
    if len(sys.argv) < 2:
        logging.error("Folder path argument is missing")
        return

    downloads_folder = sys.argv[1]
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(downloads_folder, exist_ok=True)

    try:
        # Step 1: Scrape auction data
        url = "https://salesweb.civilview.com/Sales/SalesSearch?countyId=9&page=1"
        logging.info(f"Starting to scrape the page: {url}")
        
        data = parse_page_selenium(url)
        if not data:
            logging.error("No data was found from scraping")
            return

        # Step 2: Save to database and export CSV
        db_path = os.path.join(current_dir, "auction_data.db")
        conn = connect_db()
        if conn:
            create_table(conn)
            insert_data(conn, data)
            
            # Export initial data to CSV
            exported_csv = os.path.join(downloads_folder, "exported_data.csv")
            export_data_to_csv(db_path, exported_csv)
            
            close_db(conn)
            logging.info(f"Data exported to {exported_csv}")

            # Generate Zillow URLs
            zillow_csv = os.path.join(downloads_folder, "exported_zillow_urls.csv")
            df = pd.read_csv(exported_csv)
            
            results = []
            for address in df['address']:
                zillow_url = format_zillow_url(address)
                if zillow_url:
                    results.append({'address': address, 'Zillow URL': zillow_url})
            
            pd.DataFrame(results).to_csv(zillow_csv, index=False)
            logging.info(f"Zillow URLs exported to {zillow_csv}")

            # Merge the files
            from merge_csv import merge_csv_files
            try:
                merge_csv_files(
                    address_file=exported_csv,
                    zillow_url_file=zillow_csv,
                    output_file=os.path.join(downloads_folder, 'merged_data.csv')
                )
                logging.info("Files merged successfully")
            except Exception as e:
                logging.error(f"Error merging files: {e}")
                raise

            # Save formatted data for frontend
            frontend_data = [format_for_frontend(item) for item in data]
            frontend_file = os.path.join(downloads_folder, 'frontend_property_data.json')
            export_formatted_data(frontend_data, frontend_file)

            return True

    except Exception as e:
        logging.error(f"Error in main: {str(e)}")
        raise

if __name__ == "__main__":
    main()