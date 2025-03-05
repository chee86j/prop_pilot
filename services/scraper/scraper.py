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
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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

def parse_page_selenium(url: str) -> list[dict]:
    """
    Parse property auction data from the given URL using Selenium
    
    Args:
        url (str): The URL to scrape
        
    Returns:
        list[dict]: List of property data dictionaries
    """
    logger.info("🔄 Starting Selenium scraper for URL: %s", url)
    
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        driver = webdriver.Chrome(options=options)
        
        logger.info("🌐 Loading page...")
        driver.get(url)
        
        # Wait for the main content to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "property-listing"))
        )
        
        # Extract property data
        properties = []
        listings = driver.find_elements(By.CLASS_NAME, "property-listing")
        
        for listing in listings:
            property_data = {
                'address': listing.find_element(By.CLASS_NAME, "address").text,
                'price': listing.find_element(By.CLASS_NAME, "price").text,
                'auction_date': listing.find_element(By.CLASS_NAME, "date").text
            }
            properties.append(property_data)
        
        logger.info("✅ Successfully scraped %d properties", len(properties))
        return properties
        
    except Exception as e:
        logger.error("❌ Scraping failed: %s", str(e))
        return None
        
    finally:
        if 'driver' in locals():
            driver.quit()
            logger.info("🔌 Selenium driver closed")

def convert_date_format(date_str):
    """Convert date string from 'MM/DD/YYYY' to 'YYYY-MM-DD' if needed."""
    try:
        return datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')
    except ValueError:
        logging.error(f"Date conversion error for date: {date_str}")
        return date_str  # Return original if error occurs
