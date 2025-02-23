import sys
import os
import logging
import pandas as pd
from scraper import parse_page_selenium
from database import connect_db, create_table, insert_data, close_db
from merge_csv import merge_csv_files

# Configure logging 
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s:%(levelname)s:%(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

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

def main():
    try:
        # Ensure downloads folder exists
        downloads_folder = os.path.join(os.path.dirname(__file__), 'downloads')
        os.makedirs(downloads_folder, exist_ok=True)
        
        # Step 1: Scrape auction data
        url = "https://salesweb.civilview.com/Sales/SalesSearch?countyId=9"
        logging.info(f"Starting to scrape the page: {url}")
        
        data = parse_page_selenium(url)
        if not data:
            logging.error("No data was found from scraping")
            return

        # Step 2: Save to database
        conn = connect_db()
        if not conn:
            logging.error("Failed to connect to database")
            return

        try:
            create_table(conn)
            insert_data(conn, data)
            
            # Step 3: Export initial data to CSV
            exported_csv = os.path.join(downloads_folder, "exported_data.csv")
            df = pd.DataFrame(data)
            df.to_csv(exported_csv, index=False)
            logging.info(f"Data exported to {exported_csv}")

            # Step 4: Generate Zillow URLs
            zillow_csv = os.path.join(downloads_folder, "exported_zillow_urls.csv")
            results = []
            for address in df['address']:
                zillow_url = format_zillow_url(address)
                if zillow_url:
                    results.append({'address': address, 'Zillow URL': zillow_url})
            
            pd.DataFrame(results).to_csv(zillow_csv, index=False)
            logging.info(f"Zillow URLs exported to {zillow_csv}")

            # Step 5: Merge the files
            output_file = os.path.join(downloads_folder, 'merged_data.csv')
            merge_csv_files(
                address_file=exported_csv,
                zillow_url_file=zillow_csv,
                output_file=output_file
            )
            logging.info(f"Files merged successfully to {output_file}")

        finally:
            close_db(conn)

        return True

    except Exception as e:
        logging.error(f"Error in main: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        logging.info("Script completed successfully")
        sys.exit(0)
    else:
        logging.error("Script failed to complete")
        sys.exit(1)
        
# In order to start the scraper you will need to run the following command:
# 1. `python main.py`
# 2. `viewer.py` to view the data in the frontend and add extra data from the Details
#    links that you will have to manually click on.