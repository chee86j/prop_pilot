import random
from app import app
from datetime import date
from models import db, User, Property, Phase
from werkzeug.security import generate_password_hash
from images import avatar_image_base64

# Constants
PROPERTY_PREFIXES = ["Cozy", "Spacious", "Modern", "Luxurious", "Charming",
                     "Elegant", "Stylish", "Classic", "Affordable", "Grand"]

ARCHITECTURAL_STYLES = ["Tudor Revival", "Colonial Revival", "Cape Cod", "Craftsman",
                       "Victorian", "Ranch", "Split-Level", "Minimal Traditional",
                       "Contemporary", "Modern Townhouse", "Modern Condo", "Row House",
                       "Brownstone", "Federal", "Greek Revival", "Queen Anne",
                       "Neo-Grec", "Romanesque Revival", "Italianate", "Beaux-Arts",
                       "Art Deco", "Ranch", "Mid-Century Modern", "Loft",
                       "Industrial", "Penthouse Apartment", "Dutch Colonial"]

BOROUGH_STREET_MAP = {
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

def create_default_user():
    """Create and return a default user"""
    user = User(
        first_name="Harry",
        last_name="Potter",
        email="hpotter@gmail.com",
        password_hash=generate_password_hash("Qwe123!!"),
        avatar=avatar_image_base64
    )
    db.session.add(user)
    db.session.commit()
    return user

def generate_property_data(user_id):
    """Generate a single property with random data"""
    borough = random.choice(list(BOROUGH_STREET_MAP.keys()))
    street = random.choice(BOROUGH_STREET_MAP[borough])
    property_name = f"{random.choice(PROPERTY_PREFIXES)} {random.choice(ARCHITECTURAL_STYLES)} {random.randint(1, 999)}"
    
    # Generate ARV and rehab costs
    arv_sale_price = random.randint(1700000, 25800000)
    total_rehab_cost = random.randint(50000, 5350000)
    # Calculate purchase cost adhering to the 70% Rule with 25%-100% variability
    max_purchase_price = (arv_sale_price * 0.70) - total_rehab_cost
    purchase_cost = max(0, round(random.uniform(0.25, 1.0) * max_purchase_price))

    return Property(
        user_id=user_id,
        propertyName=property_name,
        address=f"{random.randint(1, 999)} {street}",
        purchaseCost=purchase_cost,
        totalRehabCost=total_rehab_cost,
        arvSalePrice=arv_sale_price,
        city=borough
    )

def create_initial_phase(property_id):
    """Create an initial phase for a property"""
    return Phase(
        property_id=property_id,
        name="Initial Phase - Start Adding Phases Here",
        startDate=date(2025, 1, 2),
        expectedStartDate=date(2025, 1, 1),
        endDate=date(2025, 1, 2),
        expectedEndDate=date(2025, 1, 1)
    )

def seed_data():
    """Main function to seed the database"""
    with app.app_context():
        # Reset database
        db.drop_all()
        db.create_all()

        # Create user
        user = create_default_user()

        # Create Properties
        properties = [generate_property_data(user.id) for _ in range(500)]
        db.session.bulk_save_objects(properties)
        db.session.commit()

        # Commit all Properties to Establish IDs
        all_properties = Property.query.all()
        
        # Create Initial Phases for all Properties based on IDs
        phases = []
        for property in all_properties:
            phase = Phase(
                property_id=property.id,
                name="Initial Phase",
                startDate=date(2025, 1, 2),
                expectedStartDate=date(2025, 1, 1),
                endDate=date(2025, 1, 2),
                expectedEndDate=date(2025, 1, 1)
            )
            phases.append(phase)

        # Bulk Save Phases
        db.session.bulk_save_objects(phases)
        db.session.commit()

        print("Seed data inserted successfully.")

if __name__ == "__main__":
    seed_data()

"""
### Real Estate Flipping: The 70% Rule

    # The core rule for real estate flippers, although not a hard-and-fast law, revolves 
    # around making a profit. This profit depends heavily on a careful calculation of 
    # purchase price, renovation costs (also known as rehab costs), and the after-repair 
    # value (ARV). Here's a breakdown of the general rule and the factors involved:

### The General Rule: The 70% Rule (Often Used as a Starting Point) ###

    # The most commonly cited rule is the 70% Rule. It suggests that a flipper should aim to:
    # Pay no more than 70% of the After-Repair Value (ARV), minus the estimated cost of 
    # repairs (rehab).


### Formula: ###

# Maximum Purchase Price = (ARV * 0.70) - Rehab Costs


### Let's Break It Down: ###

    # ARV (After-Repair Value): This is the estimated market value of the property after all 
    # planned renovations have been completed. It's crucial to get an accurate ARV from 
    # reliable sources (comparable sales, real estate agents, appraisers).

    # Rehab Costs (Renovation Costs): These are all expenses related to fixing, improving, 
    # or modernizing the property. This includes materials, labor, permits, and any 
    # unexpected costs (which should always be factored in).

    # 70%: The 70% rule is an initial target, not a strict rule. It's a buffer to help 
    # ensure there is a profit margin, accounting for holding costs, selling costs, and 
    # a safety net for unforeseen issues.


### Why This Rule? ###

    # Profit Margin: The difference between the total cost (purchase + rehab) and the ARV 
    # is your potential profit. The 70% rule helps to ensure a decent profit margin after 
    # accounting for the aforementioned costs.

    # Safety Net: Real estate investing involves risks. This buffer helps cover holding 
    # costs (taxes, insurance, utilities), selling costs (agent fees, closing costs), and 
    # any unexpected expenses during the rehab process.

    # Market Fluctuations: The real estate market can be volatile, so having a cushion 
    # helps protect against potential price drops.


### Important Considerations Beyond the 70% Rule: ###

    # Market Conditions: The 70% rule is more of a guideline and may need to be adjusted 
    # based on the specific market you are investing in. A hot market might allow for a 
    # slightly higher purchase percentage. A slower market would likely call for a stricter 
    # interpretation.

    # Investor Experience: Experienced flippers may be comfortable with a more aggressive 
    # approach. However, beginners are generally advised to follow the 70% rule (or even 
    # a more conservative approach) until they gain expertise.

    # Type of Rehab: The scope of the rehab will heavily influence the expenses and 
    # potential profit. A basic cosmetic refresh will cost less than a full structural 
    # overhaul.

    # Holding Costs: These costs are incurred while you own the property. Interest 
    # payments, insurance, property taxes, utilities, and any HOA fees will chip away 
    # at your profit. They need to be factored into the overall cost.

    # Selling Costs: These include real estate agent commissions, closing costs, and 
    # marketing expenses.

    # Profit Goals: Investors have different financial goals. Some may be happy with 
    # a smaller, consistent profit, while others are looking for larger gains.

    # Financing: Your financing terms and interest rates can impact the overall cost 
    # of the project.
"""