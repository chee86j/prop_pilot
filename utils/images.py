import base64
import requests
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

@lru_cache(maxsize=100)
def url_to_base64(image_url: str) -> str | None:
    """
    Convert an image URL to base64 string with caching.
    Uses lru_cache to prevent repeated fetches of the same avatar.
    
    Args:
        image_url: URL of the image to convert
        
    Returns:
        str: Base64 encoded image with data URI scheme
        None: If conversion fails
    """
    try:
        response = requests.get(image_url, timeout=5)
        response.raise_for_status()
        
        content_type = response.headers.get('content-type', 'image/jpeg')
        image_base64 = base64.b64encode(response.content).decode('utf-8')
        return f"data:{content_type};base64,{image_base64}"
    
    except Exception as e:
        logger.error(f"🚫 Failed to convert {image_url}: {str(e)}")
        return None 