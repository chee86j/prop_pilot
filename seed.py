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
            first_name="Tom",
            last_name="Riddle",
            email="triddle@gmail.com",
            password_hash=generate_password_hash("Qwe123!!")
        )
        db.session.add(user)
        db.session.commit()

        # Define random values for property attributes
        street_names = [
            "Main St", "1st Ave", "2nd Ave", "3rd Ave", "Horace Harding Expwy",
            "Grand Central Pkwy", "Northern Blvd", "73rd Ave", "168th St", "188th St",
            "Park Ave", "Madison Ave", "34th St", "Union St", "5th Ave"
        ]
        property_prefixes = [
            "Cozy", "Spacious", "Modern", "Luxurious", "Charming",
            "Elegant", "Stylish", "Classic", "Affordable", "Grand"
        ]

        # Create 100 randomized properties for the user
        properties = []
        for i in range(1, 101):
            property_name = f"{random.choice(property_prefixes)} Property {i}"
            address = f"{random.randint(1, 999)} {random.choice(street_names)}"
            purchase_cost = random.randint(800000, 1500000)
            total_rehab_cost = random.randint(50000, 350000)
            arv_sale_price = random.randint(1700000, 2800000)

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
