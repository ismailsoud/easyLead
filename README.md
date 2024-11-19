# Google Maps Lead Generator

A full-stack web application that helps generate leads from Google Maps by scraping business information based on search queries. The application provides a clean interface to search for businesses and export the results to CSV format.

## Features

- 🔍 Search businesses on Google Maps
- 📊 View results in a clean, sortable table
- 📥 Export results to CSV
- 📱 Responsive design
- ⚡ Real-time scraping
- 💼 Comprehensive business information including:
  - Business name
  - Address
  - Rating and reviews
  - Business type
  - Contact information
  - Website links
  - Google Maps links

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS for styling
- Heroicons for icons
- Axios for API requests

### Backend
- Node.js
- Express.js
- Puppeteer for web scraping
- CSV Writer for file exports
- CORS for cross-origin requests

## Setup

1. Clone the repository

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd backend
npm install
```

3. Start the backend server
```bash
cd backend
npm run dev
```

4. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

1. Enter a search query in the search box (e.g., "restaurants in New York")
2. Click the Search button to initiate the scraping process
3. View the results in the table
4. Click the "Download CSV" button to export the results

## API Endpoints

### POST /api/scrape
- Accepts a search query and returns scraped business data
- Request body: `{ "searchQuery": "your search query" }`

### GET /api/download
- Downloads the latest search results as a CSV file

## Development

- Backend runs on port 5000
- Frontend development server runs on port 5173 (default Vite port)
- The backend uses nodemon for automatic server restarts during development

## Notes

- The scraping process may take some time depending on the search query and number of results
- Rate limiting may apply based on Google Maps' policies
- Ensure you have a stable internet connection for reliable scraping

## License

ISC
