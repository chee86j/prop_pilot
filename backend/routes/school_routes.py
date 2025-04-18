from flask import Blueprint, jsonify, request
from typing import Dict, List
from services.school_data_service import SchoolDataService
import logging
import os

logger = logging.getLogger(__name__)
school_bp = Blueprint('schools', __name__)

# Initialize the service with API key from environment
school_service = SchoolDataService(api_key=os.getenv('SCHOOL_DATA_API_KEY'))

@school_bp.route('/api/schools/nearby', methods=['GET'])
def get_schools_nearby() -> Dict:
    """
    Get schools near a specific location.
    
    Query Parameters:
        lat: Latitude coordinate
        lng: Longitude coordinate
        radius: Search radius in miles (default: 5)
        limit: Maximum number of results (default: 10)
    """
    try:
        # Get query parameters
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        radius = int(request.args.get('radius', 5))
        limit = int(request.args.get('limit', 10))
        
        logger.info(f'🌍 Searching for schools near coordinates: {lat}, {lng}')
        
        # Get schools from service
        schools = school_service.get_schools_by_location(
            latitude=lat,
            longitude=lng,
            radius_miles=radius,
            limit=limit
        )
        
        # Convert schools to dictionary format
        schools_data = [
            {
                'name': school.name,
                'address': school.address,
                'city': school.city,
                'state': school.state,
                'zip_code': school.zip_code,
                'grade_range': school.grade_range,
                'school_type': school.school_type,
                'location': {
                    'lat': school.latitude,
                    'lng': school.longitude
                },
                'student_count': school.student_count,
                'rating': school.rating
            }
            for school in schools
        ]
        
        return jsonify({
            'status': 'success',
            'data': schools_data
        })
        
    except ValueError as e:
        logger.error(f'❌ Invalid input parameters: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': 'Invalid input parameters'
        }), 400
    except Exception as e:
        logger.error(f'❌ Error fetching schools: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch schools'
        }), 500

@school_bp.route('/api/schools/<school_id>', methods=['GET'])
def get_school_details(school_id: str) -> Dict:
    """
    Get detailed information about a specific school.
    
    Parameters:
        school_id: Unique identifier for the school
    """
    try:
        logger.info(f'📚 Fetching details for school ID: {school_id}')
        
        school = school_service.get_school_details(school_id)
        
        if not school:
            return jsonify({
                'status': 'error',
                'message': 'School not found'
            }), 404
            
        school_data = {
            'name': school.name,
            'address': school.address,
            'city': school.city,
            'state': school.state,
            'zip_code': school.zip_code,
            'grade_range': school.grade_range,
            'school_type': school.school_type,
            'location': {
                'lat': school.latitude,
                'lng': school.longitude
            },
            'student_count': school.student_count,
            'rating': school.rating
        }
        
        return jsonify({
            'status': 'success',
            'data': school_data
        })
        
    except Exception as e:
        logger.error(f'❌ Error fetching school details: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch school details'
        }), 500 