import random
from app import app
from models import db, User, Property
from werkzeug.security import generate_password_hash

def seed_data():
    with app.app_context():
        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()

        # Create a default user
        user = User(
            first_name="Harry",
            last_name="Potter",
            email="hpotter@gmail.com",
            password_hash=generate_password_hash("Qwe123!!")
        )
        db.session.add(user)
        db.session.commit()

        # Define random values for property attributes
        architectural_styles = [
            "Tudor Revival", "Colonial Revival", "Cape Cod", "Craftsman", 
            "Victorian", "Ranch", "Split-Level", "Minimal Traditional",
            "Contemporary", "Modern Townhouse", "Modern Condo", "Row House",
            "Brownstone", "Federal", "Greek Revival", "Queen Anne",
            "Neo-Grec", "Romanesque Revival", "Italianate", "Beaux-Arts",
            "Art Deco", "Ranch", "Mid-Century Modern", "Loft",
            "Industrial", "Penthouse Apartment", "Dutch Colonial"
        ]
        street_names = [
        "Main St", "1st Ave", "2nd Ave", "3rd Ave", "Horace Harding Expwy",
        "Grand Central Pkwy", "Northern Blvd", "73rd Ave", "168th St", "188th St",
        "Park Ave", "Madison Ave", "34th St", "Union St", "5th Ave", "Nostrand Ave",
        "Broadway", "Wall Street", "Lexington Ave", "Fulton St", "Flatbush Ave",
        "Atlantic Ave", "Bedford Ave", "Smith St", "Court St", "Montague St",
        "Henry St", "Clinton St", "Joralemon St", "Cranberry St", "Pineapple St",
        "Orange St", "Columbia Heights", "Willow St", "Middagh St", "Clark St",
        "Hicks St", "Columbia St", "Van Brunt St", "Richards St",
        "Mulberry St", "Mott St", "Bleecker St", "Houston St", "Prince St",
        "Spring St", "Broome St", "Grand St", "Delancey St", "Rivington St",
        "Orchard St", "Ludlow St", "Essex St", "Allen St", "Eldridge St",
        "Chrystie St", "Bowery", "Canal St", "Walker St", "White St",
        "Ocean Parkway", "Avenue U", "Avenue X", "Avenue Z", "Kings Highway",
        "Flatlands Ave", "Avenue H", "Avenue J", "Avenue M", "Avenue N",
        "Avenue P", "Avenue L", "Avenue O", "Avenue I", "Avenue K",
        "Eastern Pkwy", "Empire Blvd", "Rogers Ave",
        "Steinway St", "Ditmars Blvd", "Astoria Blvd", "Queens Blvd", "Jamaica Ave",
        "Liberty Ave", "Ditmas Ave", "Coney Island Ave", "Rockaway Beach Blvd",
        "Beach 116th St", "Beach 105th St", "Beach 98th St", "Hylan Blvd",
        "Richmond Ave", "Victory Blvd", "Forest Ave", "Castleton Ave",
        "St. Marks Pl", "Avenue A", "Avenue B", "Avenue C", "Avenue D",
        "Avenue E", "Avenue F", "Avenue G", "Richmond Terrace",
        "Bay St", "Front St", "Water St", "South St", "Broad St",
        ]
        property_prefixes = [
            "Cozy", "Spacious", "Modern", "Luxurious", "Charming",
            "Elegant", "Stylish", "Classic", "Affordable", "Grand"
        ]

        # Create 100 randomized properties for the user
        properties = []
        for i in range(1, 101):
            property_name = f"{random.choice(property_prefixes)} {random.choice(architectural_styles)} {i}"
            address = f"{random.randint(1, 999)} {random.choice(street_names)}"
            purchase_cost = random.randint(600000, 15400000)
            total_rehab_cost = random.randint(50000, 5350000)
            arv_sale_price = random.randint(1700000, 25800000)

            property = Property(
                user_id=user.id,
                propertyName=property_name,
                address=address,
                purchaseCost=purchase_cost,
                totalRehabCost=total_rehab_cost,
                arvSalePrice=arv_sale_price
            )
            properties.append(property)

        db.session.bulk_save_objects(properties)
        db.session.commit()

        print("Seed data inserted successfully.")

if __name__ == "__main__":
    seed_data()
