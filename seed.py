import random
from app import app
from datetime import date, timedelta
from models import db, User, Property, Phase
from werkzeug.security import generate_password_hash
from images import avatar_image_base64
import math

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

def calculate_rehab_category(purchase_cost, total_rehab_cost):
    """Calculate the renovation category based on rehab cost as percentage of purchase price"""
    if purchase_cost == 0:
        return "light"
    
    rehab_percentage = (total_rehab_cost / purchase_cost) * 100
    
    if rehab_percentage <= 10:
        return "light"
    elif rehab_percentage <= 20:
        return "medium"
    elif rehab_percentage <= 30:
        return "heavy"
    else:
        return "full_gut"

def get_phase_duration(phase_name, rehab_category):
    """Get the duration range for a phase based on the renovation category"""
    # Base durations in days
    durations = {
        "Finding the Deal": (14, 21),  # 2-3 weeks
        "Understanding Financials": (14, 21),  # 2-3 weeks
        "Loan and Lender Consideration": (14, 21),  # 2-3 weeks
        "Purchase and Renovation Costs": (5, 7),  # 1 week
        "Due Diligence": (14, 21),  # 2-3 weeks
        "Contract Negotiations": (10, 14),  # 2 weeks
        "Legal and Compliance Steps": (10, 14),  # 2 weeks
        "Renovation Preparation": (14, 21),  # 2-3 weeks
        "Demolition (Operator)": {
            "light": (5, 7),
            "medium": (7, 14),
            "heavy": (14, 21),
            "full_gut": (21, 28)
        },
        "Rough-In (Operator)": {
            "light": (14, 21),
            "medium": (21, 35),
            "heavy": (35, 42),
            "full_gut": (42, 56)
        },
        "Rough-In Inspections (Municipal)": (5, 10),  # 1-2 weeks
        "Utility Setup": (7, 14),  # 1-2 weeks
        "Finals (Operator)": {
            "light": (14, 21),
            "medium": (21, 35),
            "heavy": (35, 42),
            "full_gut": (42, 56)
        },
        "Final Inspections (Municipal)": (5, 10),  # 1-2 weeks
        "Listing and Marketing": (30, 60)  # 1-2 months
    }
    
    if phase_name in ["Demolition (Operator)", "Rough-In (Operator)", "Finals (Operator)"]:
        return durations[phase_name][rehab_category]
    return durations.get(phase_name, (7, 14))  # Default 1-2 weeks if not specified

def create_property_phases(property_id, purchase_cost, total_rehab_cost):
    """Create realistic phases for a property based on its characteristics"""
    phases = []
    rehab_category = calculate_rehab_category(purchase_cost, total_rehab_cost)
    
    # Phase names in chronological order
    phase_names = [
        "Finding the Deal",
        "Understanding Financials",
        "Loan and Lender Consideration",
        "Purchase and Renovation Costs",
        "Due Diligence",
        "Contract Negotiations",
        "Legal and Compliance Steps",
        "Renovation Preparation",
        "Demolition (Operator)",
        "Rough-In (Operator)",
        "Rough-In Inspections (Municipal)",
        "Utility Setup",
        "Finals (Operator)",
        "Final Inspections (Municipal)",
        "Listing and Marketing"
    ]
    
    # Start date will be slightly in the past to simulate ongoing projects
    current_date = date.today() - timedelta(days=random.randint(30, 90))
    
    for phase_name in phase_names:
        min_days, max_days = get_phase_duration(phase_name, rehab_category)
        
        # Add some buffer for expected dates (slightly optimistic)
        expected_duration = random.randint(min_days, max_days)
        actual_duration = expected_duration + random.randint(0, 7)  # 0-7 days delay
        
        expected_start = current_date
        actual_start = current_date + timedelta(days=random.randint(0, 3))  # 0-3 days delay in starting
        
        expected_end = expected_start + timedelta(days=expected_duration)
        actual_end = actual_start + timedelta(days=actual_duration)
        
        # Create the phase
        phase = Phase(
            property_id=property_id,
            name=phase_name,
            expectedStartDate=expected_start,
            startDate=actual_start,
            expectedEndDate=expected_end,
            endDate=actual_end
        )
        phases.append(phase)
        
        # Update current_date for next phase
        # Some phases can overlap, so we don't always move the full duration
        if phase_name in ["Understanding Financials", "Legal and Compliance Steps", "Utility Setup"]:
            # These phases can overlap with others, so move only 25% of the duration
            current_date += timedelta(days=math.ceil(actual_duration * 0.25))
        else:
            # Regular phases move the full duration plus a small gap
            current_date = actual_end + timedelta(days=random.randint(1, 3))
    
    return phases

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
        
        # Create phases for each property
        for property in all_properties:
            phases = create_property_phases(property.id, property.purchaseCost, property.totalRehabCost)
            for phase in phases:
                db.session.add(phase)

        db.session.commit()

        print("Seed data inserted successfully.")

def seed_database():
    """Seed the database with initial data"""
    # Create test user
    test_user = User(
        email="test@example.com",
        password_hash=generate_password_hash("password123"),
        first_name="Test",
        last_name="User"
    )
    db.session.add(test_user)
    db.session.commit()

    # Create some test properties
    properties = []
    for i in range(5):
        # Generate realistic property values following the 70% Rule
        arv = random.randint(200000, 500000)  # After Repair Value
        max_purchase = arv * 0.7  # 70% of ARV
        purchase_cost = max_purchase - random.randint(10000, 30000)  # Slightly below max for profit
        total_rehab_cost = (max_purchase - purchase_cost) * random.uniform(0.8, 1.2)  # Variation in rehab costs
        
        property = Property(
            user_id=test_user.id,
            propertyName=f"Test Property {i+1}",
            address=f"123 Test St #{i+1}",
            city="Test City",
            state="TS",
            zipCode="12345",
            purchaseCost=purchase_cost,
            totalRehabCost=total_rehab_cost,
            arvSalePrice=arv
        )
        properties.append(property)
        db.session.add(property)
    
    db.session.commit()

    # Create phases for each property
    for property in properties:
        phases = create_property_phases(property.id, property.purchaseCost, property.totalRehabCost)
        for phase in phases:
            db.session.add(phase)
    
    db.session.commit()

# Real Estate Investment Logic Explanation
"""
The seeding logic above implements several key real estate investment principles:

1. The 70% Rule:
   - This fundamental rule in house flipping states that investors should pay no more than 
     70% of the After Repair Value (ARV) minus repair costs.
   - Formula: Maximum Purchase Price = (ARV × 70%) - Repair Costs
   - This builds in a 30% margin for profit and other costs (closing costs, holding costs, etc.)

2. Renovation Budget Categories (Standardized for Simplicity as Realistically Times Vary):
   - Light Rehab (5-10% of purchase price): 2-3 months
     * Cosmetic updates, paint, flooring, fixtures
   - Medium Rehab (10-20% of purchase price): 4-6 months
     * Kitchen/bath remodels, some systems updates
   - Heavy Rehab (20-30% of purchase price): 6-8 months
     * Major renovations, systems replacement
   - Full Gut (>30% of purchase price): 8-12 months
     * Complete property overhaul, structural changes

3. Project Timeline Structure:
   - Initial Phase (1-2 months):
     * Deal finding, financial analysis, and lending
   - Pre-Construction (1-1.5 months):
     * Due diligence, contracts, legal compliance
   - Construction Phases (varies by rehab category):
     * Duration scales with renovation scope
     * Includes buffer time for inspections and delays
   - Marketing Phase (up to 2 months):
     * Property listing and sale

4. Timeline Realism:
   - Includes parallel phases where appropriate
   - Adds random delays to simulate real-world conditions
   - More extensive renovations get longer timelines
   - Builds in inspection and approval periods
   - Accounts for potential weather delays in exterior work

5. Financial Relationships:
   - Purchase price and rehab costs are related to ARV
   - Larger rehab budgets get longer timelines
   - Includes buffer in both schedule and budget

This seeding structure creates realistic property scenarios that follow
industry best practices and common investment strategies in real estate.
"""

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