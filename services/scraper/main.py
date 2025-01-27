import sys
import os
import logging
from scraper import parse_page_selenium
from database import connect_db, create_table, insert_data, close_db
from utils.export_to_csv import export_data_to_csv
import pandas as pd
from merge_csv import merge_csv_files
import json
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

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

# Scraping details from a single listing's detail page
def scrape_listing_details(detail_url):
    """Scrape the details from a single listing's detail page."""
    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        driver = webdriver.Chrome(
            service=ChromeService(ChromeDriverManager().install()),
            options=chrome_options
        )
        
        driver.get(detail_url)
        wait = WebDriverWait(driver, 10)
        
        # Wait for table to load
        table = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "table-responsive")))
        html = driver.page_source
        
        # Parse the detail page content
        soup = BeautifulSoup(html, 'html.parser')
        details = {}
        
        # Find main details table
        main_table = soup.find('div', {'class': 'table-responsive'}).find('table', {'class': 'table table-striped'})
        if main_table:
            for row in main_table.find_all('tr'):
                header = row.find('td', {'class': 'heading-bold'})
                if header:
                    key = header.text.strip().replace(':', '').lower().replace(' ', '_')
                    value = row.find_all('td')[1].text.strip()
                    details[key] = value
        
        # Find and parse status history table
        status_table = soup.find('table', {'id': 'longTable'})
        if status_table:
            status_history = []
            for row in status_table.find_all('tr')[1:]:  # Skip header row
                cols = row.find_all('td')
                if len(cols) >= 2:
                    status_history.append({
                        'status': cols[0].text.strip(),
                        'date': cols[1].text.strip()
                    })
            details['status_history'] = status_history
        
        # Process specific fields
        if 'description' in details:
            desc = details['description']
            desc_fields = {
                'plaintiff_upset_price': r'Plaintiff Upset Price: \$([\d,\.]+)',
                'occupancy_status': r'Occupancy Status: ([^\n]+)',
                'dimensions': r'Approximate Dimensions: ([^\n]+)',
                'cross_street': r'Nearest Cross Street: ([^\n]+)'
            }
            
            import re
            for field, pattern in desc_fields.items():
                match = re.search(pattern, desc)
                if match:
                    value = match.group(1)
                    if 'price' in field:
                        try:
                            value = float(value.replace(',', ''))
                        except ValueError:
                            value = 0
                    details[field] = value
        
        return details
        
    except Exception as e:
        logging.error(f"Error scraping details from {detail_url}: {e}")
        return None
    finally:
        if driver:
            driver.quit()

def main():
    """Main function to handle scraping process."""
    url = "https://salesweb.civilview.com/Sales/SalesSearch?countyId=9&page=1"
    logging.info(f"Starting to scrape the page: {url}")
    
    listings_data = parse_page_selenium(url)
    
    if listings_data:
        print(f"\nFound {len(listings_data)} listings. Starting detail scraping...")
        enriched_listings = []
        
        for idx, listing in enumerate(listings_data, 1):
            print(f"\nProcessing listing {idx}/{len(listings_data)}")
            detail_url = listing.get('detail_link')
            print(f"Processing: {detail_url}")
            
            try:
                # Get detailed data for this listing
                details = scrape_listing_details(detail_url)
                if details:
                    # Merge listing data with details
                    enriched_listing = {**listing, **details}
                    enriched_listings.append(enriched_listing)
                    print(f"Successfully scraped details for listing {idx}")
                    
                    # Save progress after each successful scrape
                    pd.DataFrame(enriched_listings).to_csv('auction_details_progress.csv', index=False)
                    print("Progress saved.")
                
                time.sleep(2)  # Add delay between requests
                
            except Exception as e:
                logging.error(f"Error processing listing {idx}: {e}")
                print(f"Error processing listing {idx}: {e}")
                continue

        # Continue with database operations if we have enriched listings
        if enriched_listings:
            # Save to database
            conn = connect_db()
            if conn:
                create_table(conn)
                insert_data(conn, enriched_listings)
                close_db(conn)
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
        else:
            print("\nNo listings were successfully processed.")
            return
    else:
        logging.warning("No initial listings found to process.")
        return

if __name__ == "__main__":
    main()
