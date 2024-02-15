# Welcome to Prop Pilot

Prop Pilot is your go-to solution for modern property management. We understand
the complexities of managing properties, and that's why we've crafted a platform
that simplifies every aspect of this process. Whether you're on your first house
flipping adventure, juggling multiple properties, overseeing financials, or
communicating with tenants, Prop Pilot has got you covered.

Managing contractors is a critical part of property management. That's why Prop
Pilot includes features that make it easy to track and coordinate with contractors,
ensuring that renovations and repairs are completed efficiently and up to standard.

Designed with both desktop and mobile users in mind, our platform guarantees a
seamless experience, no matter where you are. It's time to take your property
business to the next level with Prop Pilot – not just a tool, but a game changer
in the world of REI property management.

## Technologies Used

Prop Pilot leverages a stack of modern technologies to deliver an exceptional
user experience and robust backend functionality. On the frontend, we utilize
React, complemented by Tailwind CSS for responsive and aesthetically pleasing
designs. JavaScript (ES6+), HTML5, and CSS3 are the core technologies driving
our interactive and user-friendly interfaces. The backend is powered by Flask,
a lightweight and efficient web framework in Python. Data management is handled
through Flask-SQLAlchemy with PostgreSQL as the database, ensuring secure and
scalable storage. Authentication and security are managed using Flask-JWT-Extended.
Flask-CORS is utilized to handle Cross-Origin Resource Sharing (CORS), facilitating
secure and flexible interactions between the frontend and backend. Werkzeug provides
comprehensive WSGI web application library support.

## Project Setup

### Install Dependencies

1. Install frontend dependencies by running `npm install` within the `/frontend` folder.
2. Install backend dependencies by running the following commands in the root folder:
   - `pip3 install Flask Flask-SQLAlchemy Flask-JWT-Extended Werkzeug python-dotenv psycopg2-binary flask-cors`
   - _(Note: you may need to upgrade pip3 to the latest version by running `pip3 install --upgrade pip`.)_

### Environment Variables Setup

1. Create a `.env` file in the root directory.
2. Add the following environment variables to the `.env` file (replace placeholders with your actual values):

DB_USERNAME=yourusername
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
JWT_SECRET_KEY=yourjwtsecretkey

3. Ensure that the `.env` file is added to the `.gitignore` file to prevent it from
   being tracked by version control.

### Setup PostgreSQL Database

1. Download and install PostgreSQL from [https://www.postgresql.org/download/].
2. Open a new terminal and run `psql` to open the PostgreSQL shell.
3. Create a new database:

- Run `CREATE DATABASE prop_pilot;`
- _(Optional)_ If you want a specific user to have access to the database:
  - Run `CREATE USER yourusername WITH PASSWORD 'yourpassword';`
  - Run `GRANT ALL PRIVILEGES ON DATABASE prop_pilot TO yourusername;`

4. Update your Flask app to connect to the database:

- Open the file `app.py`.
- Update the SQLAlchemy database URI: `app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://yourusername:yourpassword@localhost/prop_pilot'`

5. Connect to the database in the PostgreSQL shell:

- Run `\c prop_pilot`

### Setup Database Tables

1. Set the FLASK_APP environment variable and start a Python shell with Flask
   context by running the following commands in the root directory:

export FLASK_APP=app.py
flask shell

2. Once in the Flask shell, create the database tables by executing:

from app import db
db.create_all()

### Running the Application

1. To run the frontend, navigate to the `/frontend` directory and execute
   `npm start` or `vite`. The frontend will typically be accessible at
   `http://localhost:3000` or `http://localhost:5173`.

2. To run the backend, execute `python3 app.py` or `flask run` in the root
   directory. The backend server will be accessible at `http://localhost:5000`.
