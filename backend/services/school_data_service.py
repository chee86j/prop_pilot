import logging
import requests
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)

@dataclass
class School:
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    grade_range: str
    school_type: str
    latitude: float
    longitude: float
    rating: Optional[float] = None
    student_count: Optional[int] = None

class SchoolDataService:
    def __init__(self, api_key: str):
        """Initialize the School Data Service with API credentials."""
        self.api_key = api_key
        self.base_url = "https://api.data.gov/ed/collegescorecard/v1/schools"
        logger.info('🏫 SchoolDataService initialized')

    def get_schools_by_location(
        self,
        latitude: float,
        longitude: float,
        radius_miles: int = 5,
        limit: int = 10
    ) -> List[School]:
        """
        Get schools within a specified radius of a location.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            radius_miles: Search radius in miles
            limit: Maximum number of results to return
            
        Returns:
            List of School objects
        """
        logger.info(f'🔍 Searching for schools near coordinates: {latitude}, {longitude}')
        
        try:
            params = {
                'api_key': self.api_key,
                'fields': 'school.name,school.city,school.state,school.zip,'
                         'location.lat,location.lon,school.ownership,'
                         'school.degrees_awarded.predominant',
                'per_page': limit,
                'location.distance': f'{latitude},{longitude},{radius_miles}mi'
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            schools_data = response.json()['results']
            schools = []
            
            for school_data in schools_data:
                school = School(
                    name=school_data.get('school.name', ''),
                    address='',  # Address not available in this API
                    city=school_data.get('school.city', ''),
                    state=school_data.get('school.state', ''),
                    zip_code=school_data.get('school.zip', ''),
                    grade_range='',  # Not available in this API
                    school_type=self._get_school_type(school_data.get('school.ownership')),
                    latitude=school_data.get('location.lat', 0),
                    longitude=school_data.get('location.lon', 0)
                )
                schools.append(school)
            
            logger.info(f'✅ Found {len(schools)} schools')
            return schools
            
        except requests.exceptions.RequestException as e:
            logger.error(f'❌ Error fetching school data: {str(e)}')
            raise

    def _get_school_type(self, ownership_code: int) -> str:
        """Convert ownership code to school type."""
        school_types = {
            1: 'Public',
            2: 'Private Non-Profit',
            3: 'Private For-Profit'
        }
        return school_types.get(ownership_code, 'Unknown')

    def get_school_details(self, school_id: str) -> Optional[School]:
        """
        Get detailed information about a specific school.
        
        Args:
            school_id: Unique identifier for the school
            
        Returns:
            School object with detailed information
        """
        logger.info(f'📚 Fetching details for school ID: {school_id}')
        
        try:
            params = {
                'api_key': self.api_key,
                'id': school_id,
                'fields': 'school.name,school.city,school.state,school.zip,'
                         'location.lat,location.lon,school.ownership,'
                         'school.degrees_awarded.predominant,'
                         'student.size,latest.student.demographics.race_ethnicity'
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            school_data = response.json()['results'][0]
            
            return School(
                name=school_data.get('school.name', ''),
                address='',  # Address not available in this API
                city=school_data.get('school.city', ''),
                state=school_data.get('school.state', ''),
                zip_code=school_data.get('school.zip', ''),
                grade_range='',  # Not available in this API
                school_type=self._get_school_type(school_data.get('school.ownership')),
                latitude=school_data.get('location.lat', 0),
                longitude=school_data.get('location.lon', 0),
                student_count=school_data.get('student.size')
            )
            
        except (requests.exceptions.RequestException, IndexError) as e:
            logger.error(f'❌ Error fetching school details: {str(e)}')
            return None 