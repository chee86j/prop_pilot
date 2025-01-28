from typing import Dict, List, Any
import json
import logging

def format_zillow_url(address: str) -> str | None:
    """Convert the address to a Zillow URL format."""
    try:
        formatted_address = address.replace(" ", "-").replace(",", "")
        return f"https://www.zillow.com/homes/{formatted_address}_rb/"
    except Exception as e:
        logging.error(f"Error formatting Zillow URL for {address}: {e}")
        return None

def format_for_frontend(data: Dict[str, Any]) -> Dict[str, Any]:
    """Format scraped data for frontend PropertyDetails component."""
    formatted_data = {
        'propertyName': data.get('address', ''),
        'address': data.get('address', ''),
        'city': '',  # Would need to parse from address
        'state': '',  # Would need to parse from address
        'zipCode': '',  # Would need to parse from address
        'county': '',  # Would need to parse from address
        'purchaseCost': data.get('price', 0),
        'arvSalePrice': data.get('arv', 0),
        'propertyType': data.get('property_type', ''),
        'bedroomsDescription': data.get('bed_bath_sqft', '').split('bd')[0].strip() if data.get('bed_bath_sqft') else '',
        'bathroomsDescription': data.get('bed_bath_sqft', '').split('ba')[0].split('bd')[1].strip() if data.get('bed_bath_sqft') else '',
        'yearlyPropertyTaxes': sum(float(item['property_taxes'].replace('$', '').replace(',', '')) 
                                 for item in data.get('tax_history', [])[:1]) if data.get('tax_history') else 0,
    }
    
    if 'zillow_details' in data:
        zestimate = data['zillow_details'].get('zestimate', '').replace('$', '').replace(',', '')
        formatted_data['zestimate'] = float(zestimate) if zestimate.replace('.', '').isdigit() else 0

    return formatted_data

def export_formatted_data(formatted_data: List[Dict[str, Any]], output_file: str) -> None:
    """Export formatted data as JSON for frontend consumption."""
    try:
        with open(output_file, 'w') as f:
            json.dump(formatted_data, f, indent=2)
        logging.info(f"Frontend-formatted data exported to {output_file}")
    except Exception as e:
        logging.error(f"Error exporting frontend data: {e}")
