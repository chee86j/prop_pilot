from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize SQLAlchemy with no settings
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(512), nullable=False)
    last_name = db.Column(db.String(512), nullable=False)
    email = db.Column(db.String(512), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
