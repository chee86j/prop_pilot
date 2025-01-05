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

        borough_street_map = {
            "Queens": [
                 "Horace Harding Expwy", "Grand Central Pkwy", "Northern Blvd",
                 "73rd Ave", "168th St", "188th St", "Steinway St",
                 "Ditmars Blvd", "Astoria Blvd", "Queens Blvd", "Jamaica Ave",
                 "Liberty Ave", "Rockaway Beach Blvd", "Beach 116th St",
                 "Beach 105th St", "Beach 98th St", "Bell Blvd", "Union Tpke",
                 "Hillside Ave", "Sutphin Blvd", "Parsons Blvd", "Merrick Blvd",
                 "Guy R Brewer Blvd", "Springfield Blvd", "Francis Lewis Blvd",
                 "Cross Island Pkwy", "Clearview Expwy", "Van Wyck Expwy",
                 "Whitestone Expwy", "Long Island Expwy", "Woodhaven Blvd",
                 "Fresh Pond Rd", "Myrtle Ave", "Metropolitan Ave", "71st Ave",
                 "Eliot Ave", "Grand Ave", "Roosevelt Ave", "Coronoa Ave", 
                 "Jewel Ave", "Kissena Blvd", "Main St", "College Point Blvd",
                 "Bayside Ave", "Willets Point Blvd", "Northern Blvd", "Booth Memorial Hwy",
                 "Bayside Ln", "164th St", "Utopia Pkwy", "Hollis Ct Blvd", "Corporal Kennedy St",
                 "Clintonville St", "Parsons Blvd", "Ulmer St", "Elder Ave", "Pople Ave",
                 "Avery Ave", "Hillside Ave", "Elder Ave", "Colden St", "Negundo Ave",
                 "Fresh Meadows Ln", "Oceania St", "Radnor St", "Edgerton Blvd", "Kendrick Pl", 
                 "Pershing Cres", "Burden Cres", "Coolidge Ave", "Cloverdale Blvd"
            ],
                 
            "Manhattan": [
                "Main St", "1st Ave", "2nd Ave", "3rd Ave", "Park Ave",
                "Madison Ave", "34th St", "5th Ave", "Lexington Ave",
                "Wall St", "Broadway", "Mulberry St", "Mott St",
                "Bleecker St", "Houston St", "Prince St", "Spring St",
                "Broome St", "Grand St", "Delancey St", "Rivington St",
                "Orchard St", "Ludlow St", "Essex St", "Allen St",
                "Eldridge St", "Chrystie St", "Bowery", "Canal St",
                "Walker St", "White St", "Church St", "West Broadway",
                "Varick St", "Hudson St", "Greenwich St", "Washington St",
                "West St", "Battery Pl", "South St", "Pearl St",
                "Water St", "Front St", "South St", "Broad St",
                "Beekman St", "Fulton St", "John St", "Gold St",
                "Pine St", "Cedar St", "Liberty St", "Hester St"
            ],
            "Brooklyn": [
                "Nostrand Ave", "Fulton St", "Flatbush Ave", "Atlantic Ave",
                "Bedford Ave", "Smith St", "Court St", "Montague St",
                "Henry St", "Clinton St", "Joralemon St", "Cranberry St",
                "Pineapple St", "Orange St", "Columbia Heights",
                "Willow St", "Middagh St", "Clark St", "Hicks St",
                "Columbia St", "Van Brunt St", "Richards St", "Ditmas Ave",
                "Coney Island Ave", "Ocean Parkway", "Avenue U", "Avenue X",
                "Avenue Z", "Kings Highway", "Flatlands Ave", "Avenue H",
                "Avenue J", "Avenue M", "Avenue N", "Avenue P", "Avenue L",
                "Avenue O", "Avenue I", "Avenue K", "Eastern Pkwy",
                "Empire Blvd", "Rogers Ave", "Shore Pkwy", "Belt Pkwy",
                "Gowanus Expwy", "Prospect Expwy", "Linden Blvd"
            ],
           "Staten Island": [
              "Hylan Blvd", "Richmond Ave", "Victory Blvd", "Forest Ave",
              "Castleton Ave", "Richmond Terrace", "Bay St", "Front St"
            ],
            "The Bronx": [
                "Grand Concourse", "Jerome Ave", "Fordham Rd", "Arthur Ave",
                "White Plains Rd", "Pelham Parkway", "Bronx River Pkwy",
                "East Tremont Ave", "Bruckner Blvd", "Hunts Point Ave",
                "Southern Blvd", "Webster Ave", "Westchester Ave"
            ]
        }


        property_prefixes = [
            "Cozy", "Spacious", "Modern", "Luxurious", "Charming",
            "Elegant", "Stylish", "Classic", "Affordable", "Grand"
        ]


        # Create 100 randomized properties for the user
        properties = []
        for i in range(1, 501):
            property_name = f"{random.choice(property_prefixes)} {random.choice(architectural_styles)} {i}"

            # Randomly select a borough and street from the mapping
            borough = random.choice(list(borough_street_map.keys()))
            street = random.choice(borough_street_map[borough])
            address = f"{random.randint(1, 999)} {street}"

            purchase_cost = random.randint(600000, 15400000)
            total_rehab_cost = random.randint(50000, 5350000)
            arv_sale_price = random.randint(1700000, 25800000)

            property = Property(
                user_id=user.id,
                propertyName=property_name,
                address=address,
                purchaseCost=purchase_cost,
                totalRehabCost=total_rehab_cost,
                arvSalePrice=arv_sale_price,
                city=borough  # added the city/borough here
            )
            properties.append(property)

        db.session.bulk_save_objects(properties)
        db.session.commit()

        print("Seed data inserted successfully.")

if __name__ == "__main__":
    seed_data()