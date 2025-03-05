"""
Logging configuration for the scraper service
"""
import logging
import os
from typing import Optional

def setup_logger(name: str, log_file: Optional[str] = None) -> logging.Logger:
    """
    Set up a logger with file and console handlers
    
    Args:
        name (str): Logger name
        log_file (Optional[str]): Path to log file, if None only console logging is used
        
    Returns:
        logging.Logger: Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Create formatters
    file_formatter = logging.Formatter(
        '%(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_formatter = logging.Formatter(
        '[%(levelname)8s] %(message)s'
    )
    
    # Add console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    # Add file handler if log file is specified
    if log_file:
        # Ensure log directory exists
        log_dir = os.path.dirname(log_file)
        if log_dir:
            os.makedirs(log_dir, exist_ok=True)
            
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
    
    return logger 