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

        # Create 100 properties for the user
        properties = []
        for i in range(1, 101):
            property = Property(
                user_id=user.id,
                propertyName=f"Property {i}",
                address=f"{i} Main St",
                purchaseCost=100000 + i * 1000,
                totalRehabCost=20000,
                arvSalePrice=150000
            )
            properties.append(property)

        db.session.bulk_save_objects(properties)
        db.session.commit()

        print("Seed data inserted successfully.")

if __name__ == "__main__":
    seed_data()