University Digital Library

Complete system for managing digital academic resources with a FastAPI backend and a React + TypeScript frontend.

Table of Contents

Features

Technologies

Project Structure

Prerequisites

Installation

Configuration

Usage

API Endpoints

Frontend

Database Structure

Features
Backend

Full RESTful API with FastAPI

PostgreSQL database for structured data

MongoDB for full-text search and logs

Advanced search system with text indexing

Automated daily statistics

Event logging system

Resource reviews and ratings

Clean architecture with separation of layers (API, Services, Repositories)

Frontend

Modern and responsive interface with Tailwind CSS

Real-time search of resources

Statistics and metrics visualization

Interactive review system

Intuitive navigation between categories and resources

Adaptive design for mobile and tablets

Efficient state management with React Query

Technologies
Backend

Python 3.13+

FastAPI – Modern and fast web framework

SQLAlchemy – ORM for PostgreSQL

Pymongo – MongoDB driver

Pydantic – Data validation

Poetry – Dependency management

PostgreSQL – Relational database

MongoDB – NoSQL database for search and logs

Frontend

React 19 – UI library

TypeScript – Static typing

Vite – Build tool and dev server

Tailwind CSS – Styling framework

React Router – Routing

React Query – Server state management

Axios – HTTP client

Lucide React – Modern icons

Project Structure
basesIISierra/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Main pages
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
├── src/
│   └── app/
│       ├── api/              # API endpoints
│       ├── models/           # Data models
│       ├── repositories/     # Data access
│       ├── services/         # Business logic
│       ├── sql/              # SQL configuration
│       ├── nosql/            # MongoDB configuration
│       ├── batch/            # Processing scripts
│       └── main.py           # FastAPI application
├── SCRIPTS_DB/               # SQL scripts
│   ├── scriptCreationSQL.sql
│   └── scriptSeedSQL.sql
├── pyproject.toml            # Poetry configuration
└── README.md

Prerequisites

Python 3.13+

Node.js 18+ and npm

PostgreSQL 14+

MongoDB 6+

Poetry (for Python dependency management)

Installation
1. Clone the repository
git clone <repository-url>
cd basesIISierra

2. Configure the Backend
# Install Poetry if you don't have it
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Activate the virtual environment
poetry shell

3. Configure the Databases
PostgreSQL
# Create database
createdb digital_library

# Run creation scripts
psql -d digital_library -f SCRIPTS_DB/scriptCreationSQL.sql

# (Optional) Run seed scripts
psql -d digital_library -f SCRIPTS_DB/scriptSeedSQL.sql

MongoDB

Make sure MongoDB is running:

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Verify that it is running
mongosh

4. Configure Environment Variables

Create a .env file in the project root:

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DB=digital_library
PG_USER=postgres
PG_PASSWORD=postgres

# MongoDB
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=digital_library

5. Build Search Index
# From Poetry's virtual environment
python -m app.batch.build_search_index

6. Configure the Frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

Configuration
Backend Environment Variables

The backend uses the following environment variables (defined in .env):

PG_HOST: PostgreSQL host (default: localhost)

PG_PORT: PostgreSQL port (default: 5432)

PG_DB: Database name (default: digital_library)

PG_USER: PostgreSQL user (default: postgres)

PG_PASSWORD: PostgreSQL password (default: postgres)

MONGO_URL: MongoDB connection URL (default: mongodb://localhost:27017)

MONGO_DB_NAME: MongoDB database name (default: digital_library)

Frontend Environment Variables

The frontend uses:

VITE_API_URL: Backend API URL (default: http://localhost:8000
)

Usage
Start the Backend
# From the project root, with Poetry active
uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000


Or using the Poetry script:

poetry run uvicorn src.app.main:app --reload


The API will be available at: http://localhost:8000

Interactive documentation:

Swagger UI: http://localhost:8000/docs

ReDoc: http://localhost:8000/redoc

Start the Frontend
cd frontend
npm run dev


The frontend will be available at: http://localhost:5173

Batch Scripts
# Build search index
python -m app.batch.build_search_index

# Generate daily statistics
python -m app.batch.generate_daily_stats

API Endpoints
Resources

GET /resources/ – List all resources

GET /resources/{id} – Get a specific resource

GET /resources/{id}/authors – Get resource authors

GET /resources/{id}/categories – Get resource categories

GET /resources/{id}/keywords – Get resource keywords

GET /resources/{id}/reviews – Get resource reviews

POST /resources/{id}/reviews – Add a review

Search

GET /search/?query={query} – Search resources

Categories

GET /categories/ – List all categories

Programs

GET /programs/ – List all academic programs

Statistics

GET /stats/latest – Get latest statistics

GET /stats/{date} – Get statistics by date

Logs

POST /logs/ – Register a log event

GET /logs/user/{user_id} – Get user logs

GET /logs/resource/{resource_id} – Get resource logs

Frontend
Main Pages

Home (/): Main page with search and recent resources

Resources (/resources): Full resource list with pagination

Resource Detail (/resources/:id): Full resource information with reviews

Categories (/categories): List of available categories

Statistics (/stats): Usage metrics and statistics

Search (/search?q=query): Search results

Main Components

Header: Main navigation with responsive menu

SearchBar: Reusable search bar

ResourceCard: Resource display card

Footer: Footer with links

LoadingSpinner: Loading indicator

ErrorMessage: Error messages

EmptyState: Empty state messages

Database Structure
PostgreSQL (Structured Data)

program: Academic programs

app_user: System users

license: Resource licenses

resource: Digital resources

author: Authors

category: Categories

keyword: Keywords

review: Resource reviews

daily_stats: Daily statistics

resource_author: N:M relation resources-authors

resource_category: N:M relation resources-categories

resource_keyword: N:M relation resources-keywords

MongoDB (Search and Logs)

search_index: Full-text search index

log_events: System log events

Development
Backend

The application follows a layered architecture:

API Layer (api/) → Service Layer (services/) → Repository Layer (repositories/) → Database

Frontend

The frontend uses:

React Query for server state management

React Router for navigation

Tailwind CSS for styles

TypeScript for type safety

Run Tests
# Backend (if tests are configured)
poetry run pytest

# Frontend
cd frontend
npm test

Additional Notes

The system requires the MongoDB search index to be built before using the search feature

Daily statistics must be generated using the corresponding batch script

CORS is configured to allow connections from localhost:5173 and localhost:3000

Contribution

Fork the project

Create a branch for your feature (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License

This project is part of an academic course.

Author

David Muñoz - dsmunoza@udistrital.edu.co