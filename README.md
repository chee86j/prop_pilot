# Welcome to Prop Pilot

Prop Pilot is your go-to solution for modern property management. We understand
the complexities of managing properties, and that's why we've crafted a platform
that simplifies every aspect of this process. Whether you're on your first house
flipping adventure, juggling multiple properties, overseeing financials, or
communicating w/ tenants, Prop Pilot has got you covered.

Managing contractors is a critical part of property management. That's why Prop
Pilot includes features that make it easy to track and coordinate w/ contractors,
ensuring that renovations and repairs are completed efficiently and up to standard.

Designed w/ both desktop and mobile users in mind, our platform guarantees a
smooth experience, no matter where you are. It's time to take your property
business to the next level w/ Prop Pilot – not just a tool, but a game changer
in the world of REI property management.

## Technologies Used

Prop Pilot leverages a stack of modern technologies to deliver an exceptional
user experience and robust backend functionality. On the frontend, we utilize
React, complemented by Tailwind CSS for responsive and aesthetically pleasing
designs. JavaScript (ES6+), HTML5, and CSS3 are the core technologies driving
our interactive and user-friendly interfaces. The backend is powered by Flask,
a lightweight and efficient web framework in Python. Data management is handled
through Flask-SQLAlchemy w/ PostgreSQL as the database, ensuring secure and
scalable storage. Authentication and security are managed using Flask-JWT-Extended.
Flask-CORS is utilized to handle Cross-Origin Resource Sharing (CORS), facilitating
secure and flexible interactions between the frontend and backend. Werkzeug provides
comprehensive WSGI web application library support. AG Grid is used in Prop Pilot to
provide a powerful and flexible data grid component for displaying and managing property
data. It offers features such as sorting, filtering, pagination, and inline editing,
making it easy to handle large datasets efficiently. The grid is integrated into the
React frontend and styled using Tailwind CSS to ensure a consistent look and feel w/
the rest of the application.

## Performance Optimizations

Prop Pilot employs several key optimizations to ensure fast performance and smooth user experience:

- **Caching Strategy**: Service worker implements tiered caching w/ varying durations (7 days for images, 24 hours for static assets, 1-24 hours for API responses)
- **Input Optimization**: Debounced form inputs (1000ms) and throttled scroll handling (100ms)
- **Resource Loading**: Lazy loading for images and components, w/ intelligent preloading for critical assets
- **Request Handling**: Network-first strategy for fresh data, cache-first for static content, w/ 2-3s timeout fallbacks
- **Performance Tools**: Built-in monitoring and optimization utilities for development

## Security Features

Prop Pilot implements comprehensive security measures across its stack:

- **Authentication**: JWT-based w/ 1-hour expiration, Google OAuth 2.0 integration, and secure session management
- **Data Protection**: HTTP-only cookies, secure flags, SameSite policy, and parameterized SQL queries
- **Frontend Security**: CSRF protection, secure token storage, input validation, and HTTPS communication
- **Backend Security**: Secure environment configuration, JWT hardening, and session lifetime management
- **Headers & CORS**: Strict security headers (HSTS, CSP, X-Frame-Options), configured origins, and secure error handling

For detailed security configuration, check the troubleshooting section below.

## -----PROJECT SETUP-----

### Install Dependencies

1. Install frontend dependencies by running `npm install` w/in the `/frontend` folder.
2. Install backend dependencies by running the following commands in the root folder:
   - `source .venv/bin/activate` on Mac
   - `.\venv\Scripts\activate` on Windows
   - `pip3 install -r requirements.txt`
   - _(Note: you may need to upgrade pip3 to the latest version by running `pip3 install --upgrade pip`.)_

### Google OAuth Setup

1. Go to Google Cloud Console at https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google+ API
   - Google OAuth2 API
4. Configure OAuth consent screen:
   - Set up your app's name, user support email, and developer contact
   - Add scopes: email, profile
   - Add test users if in testing mode
5. Create OAuth 2.0 credentials:
   - Choose "Web application" as the application type
   - Set the name of your OAuth 2.0 client
   - Add authorized JavaScript origins:
     ```
     http://localhost:5173
     ```
   - Add authorized redirect URIs:
     ```
     http://localhost:5173
     ```
6. Copy the generated Client ID

### Environment Variables Setup

1. Create a `.env` file in the root directory
2. Add the following environment variables:

   ```
   # Database Configuration
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=prop_pilot_db

   # JWT Configuration
   JWT_SECRET_KEY=your_secret_key

   # Flask Configuration
   FLASK_SECRET_KEY=your_flask_secret_key

   # Frontend Configuration
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. Ensure that the `.env` file is added to the `.gitignore` file to prevent it from being tracked by version control.

### Troubleshooting

- If you encounter CORS issues, verify that your CORS configuration matches the security settings
- If you see session-related errors, ensure both `JWT_SECRET_KEY` and `FLASK_SECRET_KEY` are properly set
- If you see COOP (Cross-Origin-Opener-Policy) warnings in the console, these are informational and don't affect functionality
- For Google OAuth issues:
  - Ensure all environment variables are correctly set and accessible
  - Verify Google Cloud Console settings match your application URLs
  - Check that the Client ID matches in both frontend and backend
- For security-related issues:
  - Check browser console and backend logs for detailed error messages
  - Verify all security headers are being properly set
  - Ensure cookies are being properly handled w/ secure flags
- For database connection issues:
  - Verify database credentials and permissions
  - Check that all necessary tables are created
  - Ensure proper connection string format

### Setup PostgreSQL Database

MacOs - `Postico 2` as your db management tool
Windows - `pgAdmin` or `DBeaver` or `HeidiSQL`as your db management tool

1. Download and install PostgreSQL from [https://www.postgresql.org/download/].
2. MacOs - Open a new terminal & run `psql` to open the PostgreSQL shell.
   Windows - Open a new terminal & run `psql -U postgres -d prop_pilot_db -h localhost -p 5432`
   & enter your password plus
   a. add the bin path in your `Advanced System Settings`-->`Environment Variables`-->`System Variables`-->Select `Edit` for your path and add the path to your PostgreSQL /bin folder

### Database Setup

1. Run the following in the root folder:
   `psql -U postgres`
   `CREATE DATABASE prop_pilot_db;`
   `\q`

`psql -U postgres -d prop_pilot_db -h localhost -p 5432`

_(Optional)_ If you want a specific user to have access to the database:

CREATE USER yourusername w/ PASSWORD 'yourpassword';
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

### Setup Database Migrations w/ Flask-Migrate

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

1. Set the FLASK_APP environment variable and start a Python shell w/ Flask
   context by running the following commands in the root directory:

export FLASK_APP=app.py
flask shell

2. Once in the Flask shell, create the database tables by executing:

from app import db
db.create_all()

### Running the Application

1. To run the backend,
   Execute
   MacOs - `python3 app.py` or `flask run`
   Windows - `python app.py` in the root directory.

   The backend server will be accessible at `http://localhost:5000`.

2. To run the frontend, navigate to the `/frontend` directory
   Execute
   MacOs - `npm start` or `vite`
   Windows - `npm run dev`

   The frontend will typically be accessible at
   `http://localhost:3000` or `http://localhost:5173`.

3. Optionally, you can seed the database w/ data w/ an example user by running the following command in the root directory:
   MacOs - `python3 seed.py`
   Windows - `python seed.py`

### Running Separate Foreclosure Listing Scraper Manually vs through the Property List Page

1. ChromeDriver: Download the ChromeDriver that matches your Chrome version (https://googlechromelabs.github.io/chrome-for-testing/)
   By default the Win64 version when you clone this repo is used in the services\scraper folder
2. Match w/ your OS.
3. After downloading, extract the file and note the path to the chromedriver executable.
4. Make sure the chromedriver file has executable permissions (on macOS/Linux, run chmod +x /path/to/chromedriver).
5. Update the `CHROMEDRIVER_PATH` variable in the `services/scraper/scraper.py` file to point to the chromedriver executable.
6. Run the scraper by executing the following command in the root directory:
   MacOs - `python3 services/scraper/main.py`
   Windows - `python services/scraper/main.py`
7. Follow the User Prompts in the Terminal.
