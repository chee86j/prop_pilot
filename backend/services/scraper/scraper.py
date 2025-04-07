from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from datetime import datetime
import time
from .utils.logger import setup_logger

# Configure logging
logger = setup_logger(__name__, 'logs/scraper.log')

def fetch_page_selenium(url):
    """Fetch page content using Selenium."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")  # Add this option
    
    driver = None  # Initialize driver variable
    try:
        # Initialize ChromeDriver using ChromeDriverManager
        driver = webdriver.Chrome(
            service=ChromeService(ChromeDriverManager().install()),
            options=chrome_options
        )
        
        logger.info(f"Attempting to fetch URL: {url}")
        driver.get(url)
        time.sleep(5)  # Increased wait time
        
        html_content = driver.page_source
        logger.info("Successfully fetched page content")
        return html_content

    except Exception as e:
        logger.error(f"Error fetching {url} with Selenium: {e}")
        return None

    finally:
        if driver:  # Only quit if driver was successfully initialized
            try:
                driver.quit()
                logger.info("Browser closed successfully")
            except Exception as e:
                logger.error(f"Error closing browser: {e}")

def parse_page_selenium(url):
    """Parse page content to extract required data."""
    html = fetch_page_selenium(url)
    if html:
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.find('table', class_='table table-striped')
        if not table:
            logger.error(f"Failed to find the table on the page at URL: {url}")
            return []

        data = []
        rows = table.find('tbody').find_all('tr') if table.find('tbody') else []
        
        # Determine county based on URL
        county_mapping = {
            'countyId=7': 'Bergen County',
            'countyId=10': 'Hudson County',
            'countyId=2': 'Essex County',
            'countyId=9': 'Morris County',
            'countyId=15': 'Union County',
            'countyId=19': 'Sussex County',
            'countyId=21': 'Warren County'
        }
        
        county = None
        for county_id, county_name in county_mapping.items():
            if county_id in url:
                county = county_name
                break
        
        # Determine if it's Hudson County by checking the URL
        is_hudson_county = 'countyId=10' in url
        
        for row in rows:
            cells = row.find_all('td')
            try:
                # Extract the PropertyId and construct the full detail link
                detail_link = cells[0].find('a', href=True)['href']
                if "PropertyId=" not in detail_link:
                    raise ValueError("Invalid detail link: Missing 'PropertyId'")
                
                property_id = detail_link.split("PropertyId=")[-1]
                full_detail_link = f"https://salesweb.civilview.com{detail_link}"

                # Extract other data for the row - handle Hudson County differently
                if is_hudson_county:
                    # Hudson County has Address before Plaintiff/Defendant
                    row_data = {
                        'detail_link': full_detail_link,
                        'property_id': property_id,
                        'sheriff_number': cells[1].text.strip() if len(cells) > 1 else None,
                        'status_date': convert_date_format(cells[2].text.strip()) if len(cells) > 2 else None,
                        'address': cells[3].text.strip() if len(cells) > 3 else None,
                        'plaintiff': cells[4].text.strip() if len(cells) > 4 else None,
                        'defendant': cells[5].text.strip() if len(cells) > 5 else None,
                        'price': int(cells[6].text.strip().replace('$', '').replace(',', '')) if len(cells) > 6 and cells[6].text.strip() else 0,
                        'county': county
                    }
                else:
                    # Standard column order for other counties
                    row_data = {
                        'detail_link': full_detail_link,
                        'property_id': property_id,
                        'sheriff_number': cells[1].text.strip() if len(cells) > 1 else None,
                        'status_date': convert_date_format(cells[2].text.strip()) if len(cells) > 2 else None,
                        'plaintiff': cells[3].text.strip() if len(cells) > 3 else None,
                        'defendant': cells[4].text.strip() if len(cells) > 4 else None,
                        'address': cells[5].text.strip() if len(cells) > 5 else None,
                        'price': int(cells[6].text.strip().replace('$', '').replace(',', '')) if len(cells) > 6 and cells[6].text.strip() else 0,
                        'county': county
                    }

                data.append(row_data)

            except Exception as e:
                logger.error(f"Error parsing row: {e}")
                continue

        return data
    else:
        logger.error("No HTML content returned")
        return []

def convert_date_format(date_str):
    """Convert date string from 'MM/DD/YYYY' to 'YYYY-MM-DD' if needed."""
    try:
        return datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')
    except ValueError:
        logger.error(f"Date conversion error for date: {date_str}")
        return date_str  # Return original if error occurs