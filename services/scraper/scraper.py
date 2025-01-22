from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import logging
from datetime import datetime
import time

# Configure logging
logging.basicConfig(filename='scraper.log', level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

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
        
        logging.info(f"Attempting to fetch URL: {url}")
        driver.get(url)
        time.sleep(5)  # Increased wait time
        
        html_content = driver.page_source
        logging.info("Successfully fetched page content")
        return html_content

    except Exception as e:
        logging.error(f"Error fetching {url} with Selenium: {e}")
        return None

    finally:
        if driver:  # Only quit if driver was successfully initialized
            try:
                driver.quit()
                logging.info("Browser closed successfully")
            except Exception as e:
                logging.error(f"Error closing browser: {e}")

def parse_page_selenium(url):
    """Parse page content to extract required data."""
    html = fetch_page_selenium(url)
    if html:
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.find('table', class_='table table-striped')
        if not table:
            logging.error(f"Failed to find the table on the page at URL: {url}")
            return []

        data = []
        rows = table.find('tbody').find_all('tr') if table.find('tbody') else []

        for row in rows:
            cells = row.find_all('td')
            try:
                # Extract the PropertyId and construct the full detail link
                detail_link = cells[0].find('a', href=True)['href']
                if "PropertyId=" not in detail_link:
                    raise ValueError("Invalid detail link: Missing 'PropertyId'")
                
                property_id = detail_link.split("PropertyId=")[-1]
                full_detail_link = f"https://salesweb.civilview.com{detail_link}"

                # Extract other data for the row
                row_data = {
                    'detail_link': full_detail_link,
                    'property_id': property_id,
                    'sheriff_number': cells[1].text.strip() if len(cells) > 1 else None,
                    'status_date': convert_date_format(cells[2].text.strip()) if len(cells) > 2 else None,
                    'plaintiff': cells[3].text.strip() if len(cells) > 3 else None,
                    'defendant': cells[4].text.strip() if len(cells) > 4 else None,
                    'address': cells[5].text.strip() if len(cells) > 5 else None,
                    'price': int(cells[6].text.strip().replace('$', '').replace(',', '')) if len(cells) > 6 else 0
                }

                data.append(row_data)

            except Exception as e:
                logging.error(f"Error parsing row: {e}")
                continue

        return data
    else:
        logging.error("No HTML content returned")
        return []

def convert_date_format(date_str):
    """Convert date string from 'MM/DD/YYYY' to 'YYYY-MM-DD' if needed."""
    try:
        return datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')
    except ValueError:
        logging.error(f"Date conversion error for date: {date_str}")
        return date_str  # Return original if error occurs
