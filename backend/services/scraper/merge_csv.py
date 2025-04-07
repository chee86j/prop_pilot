"""
CSV file merging utilities
"""
import pandas as pd
import logging
from typing import Optional

logger = logging.getLogger(__name__)

def merge_csv_files(address_file: str, zillow_url_file: str, output_file: str) -> bool:
    """
    Merge two CSV files based on the address column
    
    Args:
        address_file (str): Path to the CSV file containing property addresses
        zillow_url_file (str): Path to the CSV file containing Zillow URLs
        output_file (str): Path to save the merged CSV file
        
    Returns:
        bool: True if files were merged successfully
    """
    try:
        logger.info("🔄 Reading CSV files")
        df_addresses = pd.read_csv(address_file)
        df_zillow = pd.read_csv(zillow_url_file)
        
        logger.info("🔄 Merging files on 'address' column")
        df_merged = pd.merge(
            df_addresses,
            df_zillow,
            on='address',
            how='left'
        )
        
        logger.info("💾 Saving merged file to: %s", output_file)
        df_merged.to_csv(output_file, index=False)
        
        logger.info("✅ Files merged successfully")
        return True
        
    except Exception as e:
        logger.error("❌ Failed to merge CSV files: %s", str(e))
        return False

if __name__ == "__main__":
    if len(sys.argv) > 2:
        address_file = sys.argv[1]
        zillow_url_file = sys.argv[2]
        
        # Merge the CSV files
        merge_csv_files(address_file, zillow_url_file)
    else:
        logging.error("Usage: python script.py <address_file> <zillow_url_file>")
        sys.exit("Usage: python script.py <address_file> <zillow_url_file>")
