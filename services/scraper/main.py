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

def export_formatted_data(formatted_data, output_file='frontend_property_data.json'):
    """Export formatted data as JSON for frontend consumption."""
    try:
        with open(output_file, 'w') as f:
            json.dump(formatted_data, f, indent=2)
        logging.info(f"Frontend-formatted data exported to {output_file}")
    except Exception as e:
        logging.error(f"Error exporting frontend data: {e}")

def main():
    # Step 1: Scrape auction data
    url = "https://salesweb.civilview.com/Sales/SalesSearch?countyId=9&page=1"
    logging.info(f"Starting to scrape the page: {url}")
    
    data = parse_page_selenium(url)
    
    if data:
        # Format data for frontend
        frontend_formatted_data = [format_for_frontend(item) for item in data]
        
        # Export formatted data for frontend
        export_formatted_data(frontend_formatted_data)
        
        logging.info(f"Scraping completed. {len(data)} listings found.")
        conn = connect_db()
        if conn:
            create_table(conn)
            insert_data(conn, data)
            close_db(conn)
        else:
            logging.error("Failed to connect to the database.")
    else:
        logging.warning("No data scraped.")
        return  # Exit if no data was scraped
    
    # Step 2: Export scraped data to CSV
    user_input = input("Do you want to export the data to CSV? (yes/no): ").strip().lower()
    if user_input == "yes":
        db_path = "auction_data.db"
        csv_file_path = "exported_data.csv"
        
        # Export data to CSV using the imported function from utils
        export_data_to_csv(db_path, csv_file_path)
        print(f"The data has been successfully exported to {csv_file_path}")
    else:
        print("Export to CSV skipped.")

    # Step 3: Generate Zillow URLs for the addresses in the exported data
    user_input = input("Do you want to generate Zillow URLs for the addresses in the exported CSV? (yes/no): ").strip().lower()
    if user_input == "yes":
        try:
            data = pd.read_csv(csv_file_path)
            addresses = data['address'].tolist()
            
            results = []
            for address in addresses:
                zillow_url = format_zillow_url(address)
                if zillow_url:
                    results.append({'address': address, 'Zillow URL': zillow_url})
                    logging.info(f"Successfully formatted URL for {address}")
                else:
                    logging.warning(f"Failed to format URL for {address}")

            # Export Zillow URL results to CSV
            csv_file_path_zillow = 'exported_zillow_urls.csv'
            pd.DataFrame(results).to_csv(csv_file_path_zillow, index=False)
            logging.info(f"Zillow URLs have been successfully exported to {csv_file_path_zillow}")
            print(f"Zillow URLs have been successfully exported to {csv_file_path_zillow}")
            
        except Exception as e:
            logging.error(f"Failed to process addresses for Zillow URL generation: {e}")
            sys.exit(f"Failed to process addresses for Zillow URL generation: {e}")
    else:
        print("Zillow URL generation skipped.")

    # Step 4: Merge the auction data with the Zillow URLs
    user_input = input("Do you want to merge the auction data with the Zillow URLs? (yes/no): ").strip().lower()
    if user_input == "yes":
        try:
            merge_csv_files(csv_file_path, csv_file_path_zillow)
        except Exception as e:
            logging.error(f"Failed to merge files: {e}")
            sys.exit(f"Failed to merge files: {e}")
    else:
        print("Merging auction data and Zillow URLs skipped.")

if __name__ == "__main__":
    main()