class ScraperException(Exception):
    """Base exception for scraper-related errors"""
    pass

class DatabaseException(Exception):
    """Base exception for database-related errors"""
    pass

class NetworkException(Exception):
    """Base exception for network-related errors"""
    pass

class ValidationException(Exception):
    """Base exception for data validation errors"""
    pass 