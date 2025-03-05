import pytest
import os
import pandas as pd
from unittest.mock import patch, MagicMock
from services.scraper.main import main, ScraperException, DatabaseException
import logging

@pytest.fixture
def mock_downloads_folder(tmp_path):
    """Create a temporary downloads folder for testing"""
    downloads = tmp_path / "downloads"
    downloads.mkdir()
    return downloads

@pytest.fixture
def mock_data():
    """Sample scraped data for testing"""
    return [
        {'address': '123 Test St', 'price': '100000'},
        {'address': '456 Sample Ave', 'price': '200000'}
    ]

def test_main_success(mock_downloads_folder, mock_data):
    """Test successful execution of main scraper function"""
    with patch('services.scraper.main.parse_page_selenium', return_value=mock_data), \
         patch('services.scraper.main.connect_db'), \
         patch('services.scraper.main.create_table'), \
         patch('services.scraper.main.insert_data'), \
         patch('services.scraper.main.format_zillow_url', return_value='https://zillow.com/test'), \
         patch('services.scraper.main.merge_csv_files'):
        
        assert main() is True

def test_main_scraper_failure():
    """Test handling of scraper failure"""
    with patch('services.scraper.main.parse_page_selenium', return_value=None):
        assert main() is False

def test_main_database_failure(mock_data):
    """Test handling of database failure"""
    with patch('services.scraper.main.parse_page_selenium', return_value=mock_data), \
         patch('services.scraper.main.connect_db', side_effect=DatabaseException("Connection failed")):
        
        assert main() is False

def test_zillow_url_generation(mock_downloads_folder, mock_data):
    """Test Zillow URL generation for addresses"""
    with patch('services.scraper.main.parse_page_selenium', return_value=mock_data), \
         patch('services.scraper.main.connect_db'), \
         patch('services.scraper.main.create_table'), \
         patch('services.scraper.main.insert_data'), \
         patch('services.scraper.main.format_zillow_url') as mock_format_zillow:
        
        mock_format_zillow.side_effect = ['https://zillow.com/test1', 'https://zillow.com/test2']
        main()
        
        assert mock_format_zillow.call_count == 2
        mock_format_zillow.assert_any_call('123 Test St')
        mock_format_zillow.assert_any_call('456 Sample Ave') 