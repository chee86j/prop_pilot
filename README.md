# Welcome to Prop Pilot

<div align="center">

![Prop Pilot](https://img.shields.io/badge/PropPilot-Property%20Management-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Flask](https://img.shields.io/badge/Flask-Backend-000000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)

</div>

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

## Table of Contents

- [Technologies Used](#-technologies-used)
- [Performance Optimizations](#-performance-optimizations)
- [Security Features](#-security-features)
- [Project Setup](#-project-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Google OAuth Setup](#google-oauth-setup)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Troubleshooting](#-troubleshooting)
- [Foreclosure Listing Scraper](#-foreclosure-listing-scraper)

## 🛠 Technologies Used

Prop Pilot leverages a stack of modern technologies to deliver an exceptional
user experience and robust backend functionality:

### Frontend

- **React** with Vite for fast development
- **Tailwind CSS** for responsive design
- **AG Grid** for powerful data management
- **JavaScript (ES6+)**, HTML5, CSS3

### Backend

- **Flask** web framework
- **PostgreSQL** with Flask-SQLAlchemy
- **Flask-JWT-Extended** for authentication
- **Flask-CORS** for CORS handling
- **Werkzeug** for WSGI support

## Performance Optimizations

Prop Pilot employs several key optimizations to ensure fast performance and smooth user experience:

- **Caching Strategy**: Service worker implements tiered caching w/ varying durations
  - 7 days for images
  - 24 hours for static assets
  - 1-24 hours for API responses
- **Input Optimization**: Debounced form inputs (1000ms) and throttled scroll handling (100ms)
- **Resource Loading**: Lazy loading for images and components, w/ intelligent preloading
- **Request Handling**: Network-first strategy for fresh data, cache-first for static content
- **Performance Tools**: Built-in monitoring and optimization utilities

## Security Features

Prop Pilot implements comprehensive security measures across its stack:

- **Authentication**: JWT-based w/ 1-hour expiration, Google OAuth 2.0 integration
- **Data Protection**: HTTP-only cookies, secure flags, SameSite policy
- **Frontend Security**: CSRF protection, secure token storage, input validation
- **Backend Security**: Secure environment configuration, JWT hardening
- **Headers & CORS**: Strict security headers (HSTS, CSP, X-Frame-Options)

## Project Setup

### Prerequisites

- Node.js and npm
- Python 3.8+
- PostgreSQL
- Chrome (for scraper functionality)

### Installation

1. Clone the repository and navigate to the project root:

   ```bash
   git clone https://github.com/yourusername/prop_pilot.git
   cd prop_pilot   # All following commands assume you start in the root directory
   ```

2. Install frontend dependencies:

   ```bash
   # From root directory:
   cd frontend
   npm install
   cd ..          # Return to root
   ```

3. Install backend dependencies:

   ```bash
   # From root directory:
   python -m venv venv   # Create virtual environment

   # Activate virtual environment:
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate

   # Install dependencies:
   pip install -r requirements.txt
   ```

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

1. Create a `.env` file in the root directory:

   ```bash
   # From root directory:
   touch .env   # On macOS/Linux
   # OR
   echo. > .env # On Windows
   ```

   Add the following content:

   ```env
   # Database Configuration
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=prop_pilot_db

   # JWT Configuration
   JWT_SECRET_KEY=your_secret_key

   # Google OAuth Configuration
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5173/api/auth/callback

   # Frontend Configuration
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### Database Setup

1. Install PostgreSQL database tools:

   - macOS: `Postico 2`
   - Windows: `pgAdmin`, `DBeaver`, or `HeidiSQL`

2. Create the database:

   ```bash
   # From any directory (PostgreSQL command line):
   # Windows:
   psql -U postgres -d prop_pilot_db -h localhost -p 5432

   # macOS:
   psql -U postgres
   CREATE DATABASE prop_pilot_db;
   \q
   ```

3. Initialize migrations:

   ```bash
   # From root directory:
   cd backend

   # Windows:
   python -m flask db init
   python -m flask db migrate -m "Initial migration"
   python -m flask db upgrade

   # macOS:
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade

   cd ..  # Return to root
   ```

### Running the Application

1. Start the backend server:

   ```bash
   # From root directory:
   cd backend

   # Windows:
   python app.py

   # macOS:
   python3 app.py

   # The backend will be available at http://localhost:5000
   # Keep this terminal window open and running
   ```

2. Open a new terminal window and start the frontend development server:

   ```bash
   # From root directory:
   cd frontend
   npm run dev

   # The frontend will be available at http://localhost:5173
   # Keep this terminal window open and running
   ```

3. (Optional) Seed the database:
   ```bash
   # From root directory:
   cd scripts
   python seed.py
   cd ..  # Return to root
   ```

## Troubleshooting

Common issues and solutions:

- **CORS Issues**: Verify CORS configuration in backend/app.py
- **Database Connection**: Check credentials and permissions
- **Google OAuth**: Verify client ID and redirect URIs
- **Security Headers**: Check browser console for COOP warnings

For detailed error messages:

1. Check browser console
2. Review backend/logs directory
3. Verify environment variables

## Foreclosure Listing Scraper

The scraper can be run either through the Property List Page or manually:

1. Download ChromeDriver matching your Chrome version from [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/)
2. Place the ChromeDriver in `backend/services/scraper/`
3. Update permissions if needed:
   ```bash
   # From root directory:
   # On macOS/Linux:
   chmod +x backend/services/scraper/chromedriver
   ```
4. Run manually:

   ```bash
   # From root directory:
   cd backend

   # Windows:
   python services/scraper/main.py

   # macOS:
   python3 services/scraper/main.py

   cd ..  # Return to root
   ```

---

<div align="center">
Made with ❤️ by the Prop Pilot Team
</div>
