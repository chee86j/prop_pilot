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
smooth experience, no matter where you are. It's time to take your property
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
   - `python -m venv venv` on Mac
   -  `.\venv\Scripts\activate` on Windows
   - `pip3 install -r requirements.txt`
   - _(Note: you may need to upgrade pip3 to the latest version by running `pip3 install --upgrade pip`.)_
3. Google OAuth Setup
   - Go to Google Cloud Console at https://console.cloud.google.com/
   - Create project/select existing
   - Enable Google+ API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized origins:
      http://localhost:5173
   - Add authorized redirect URIs:
      http://localhost:5000/api/google/callback

### Environment Variables Setup

1. Create a `.env` file in the root directory.
2. Add the following environment variables to the `.env` file (replace placeholders with your actual values):

DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=prop_pilot_db
JWT_SECRET_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/callback
VITE_API_BASE_URL=http://localhost:5000

3. Ensure that the `.env` file is added to the `.gitignore` file to prevent it from
   being tracked by version control.

### Setup PostgreSQL Database

MacOs - `Postico 2` as your db management tool
Windows - `pgAdmin` or `DBeaver` or `HeidiSQL`as your db management tool

1. Download and install PostgreSQL from [https://www.postgresql.org/download/].
2. MacOs - Open a new terminal & run `psql` to open the PostgreSQL shell.
   Windows - Open a new terminal & run `psql -U postgres -d prop_pilot_db -h localhost -p 5432`
   & enter your password plus
   a. add the bin path in your `Advanced System Settings`-->`Environment Variables`-->`System Variables`-->Select `Edit` for your path and add the path to your PostgreSQL /bin folder

# Database Setup
1. Run the following in the root folder:
`psql -U postgres`
`CREATE DATABASE prop_pilot_db;`
`\q`

`psql -U postgres -d prop_pilot_db -h localhost -p 5432`

_(Optional)_ If you want a specific user to have access to the database:

CREATE USER yourusername WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE prop_pilot TO yourusername;

2. Update your Flask app to connect to the database:

- Open the file `app.py`.
- Update the SQLAlchemy database URI:
  ```
  app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://yourusername:yourpassword@localhost/prop_pilot'
  ```

### Configure Database Permissions

1. Ensure that the database user has sufficient privileges for operations
   such as creating tables, sequences, and handling data. This typically
   involves granting privileges on tables and sequences, like:

`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;`
`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_db_user;`

### Setup Database Migrations with Flask-Migrate

1. To manage database migrations & keep the database schema in sync we use Flask-Migrate
   (you installed it earlier).

   Run the following commands in the root directory:
   MacOs - `flask db init`
   Windows - `python -m flask db init`

2. Run the following commands in the root directory for initial migration:
   MacOs - `flask db migrate -m "Initial migration."`
   Windows - `python -m flask db migrate -m "Initial migration."`

3. Apply the migration to the database:
   MacOs - `flask db upgrade`
   Windows - `python -m flask db upgrade`

### Setup Database Tables (If NOT using Flask-Migrate)

1. Set the FLASK_APP environment variable and start a Python shell with Flask
   context by running the following commands in the root directory:

export FLASK_APP=app.py
flask shell

2. Once in the Flask shell, create the database tables by executing:

from app import db
db.create_all()

### Running the Application

1. To run the frontend, navigate to the `/frontend` directory
   Execute
   MacOs - `npm start` or `vite`
   Windows - `npm run dev`

   The frontend will typically be accessible at
   `http://localhost:3000` or `http://localhost:5173`.

2. To run the backend,
   Execute
   MacOs - `python3 app.py` or `flask run`
   Windows - `python app.py` in the root directory.

   The backend server will be accessible at `http://localhost:5000`.
