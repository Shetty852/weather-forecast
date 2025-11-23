# Weather Forecast

Simple full‑stack weather dashboard (Node + MySQL + React) with local seed data, external fallback, favorites, and location management.

## Tech Stack
- Backend: Node.js, Express, Sequelize (MySQL)
- Frontend: React (Vite)
- External API: Open‑Meteo (forecast + geocoding)
- Styling: Custom CSS

## Folder Structure
```
weather_forecast/
├─ README.md
├─ .gitignore
├─ weather-backend/
│  ├─ package.json
│  ├─ app.js
│  ├─ server.js
│  ├─ .env.example
│  ├─ config/
│  │  ├─ database.js
│  │  └─ ssl/
│  ├─ models/
│  │  ├─ index.js
│  │  ├─ location.js
│  │  ├─ weatherData.js
│  │  └─ favorite.js
│  ├─ controllers/
│  │  ├─ locationController.js
│  │  ├─ forecastController.js
│  │  └─ favoriteController.js
│  ├─ services/
│  │  ├─ forecastService.js
│  │  ├─ externalWeather.js
│  │  └─ geocodeService.js
│  ├─ routes/
│  │  ├─ index.js
│  │  ├─ locations.js
│  │  ├─ forecast.js
│  │  └─ favorites.js
│  ├─ utils/
│  │  ├─ dateUtils.js
│  │  └─ format.js
│  ├─ sql/
│  │  └─ init.sql
│  └─ logs/ (optional)
├─ weather-frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ index.html
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ App.jsx
│  │  ├─ services/
│  │  │  └─ api.js
│  │  ├─ context/
│  │  │  ├─ FavoritesContext.jsx
│  │  │  ├─ favoritesStore.js
│  │  │  └─ useFavorites.js
│  │  ├─ components/
│  │  │  ├─ Layout.jsx
│  │  │  └─ ui/
│  │  ├─ pages/
│  │  │  ├─ Home.jsx
│  │  │  ├─ Forecast.jsx
│  │  │  ├─ Locations.jsx
│  │  │  └─ Favorites.jsx
│  │  ├─ styles/
│  │  │  └─ layout.css

```

(Keep existing content below.)

## Prerequisites
- Node 18+
- MySQL 8+
- Git

## Environment Variables (backend)
```
DB_HOST=your-host
DB_PORT=3306
DB_USER=your-user
DB_PASS=your-pass
DB_NAME=defaultdb
NODE_ENV=development
WEATHER_SOURCE=auto
```

Frontend:
```
VITE_API_BASE=http://localhost:5000
```

## Install
Backend:
```bash
cd weather-backend
npm install
```
Frontend:
```bash
cd weather-frontend
npm install
```

## Run (dev)
Backend:
```bash
npm run dev
```
Frontend:
```bash
npm run dev
```
App: http://localhost:5173  
API: http://localhost:5000

## API Endpoints
```
GET  /api/locations
POST /api/locations
POST /api/locations/quick
GET  /api/forecast?location=NAME&date=YYYY-MM-DD
GET  /api/favorites
POST /api/favorites
```

## Data Models
Location:
```
id          INT PK
name        STRING (unique, trimmed, case-insensitive compare)
latitude    FLOAT
longitude   FLOAT
altitude    FLOAT (optional)
createdAt   DATETIME
updatedAt   DATETIME
```
WeatherData:
```
id          INT PK
locationId  INT FK -> Location.id
date        DATE (YYYY-MM-DD)
hour        TINYINT (0–23)
tempC       DECIMAL
condition   ENUM / STRING (clear | cloudy | rain | etc.)
humidity    INT (%)
windKph     INT
uv          INT
createdAt   DATETIME
updatedAt   DATETIME
```
Favorite:
```
id          INT PK
locationId  INT UNIQUE FK -> Location.id
createdAt   DATETIME
updatedAt   DATETIME
```
Notes:
- Unique constraints: Location.name, Favorite.locationId.
- Deleting a location should cascade or be prevented (implementation dependent).

## Error Handling
Format (error cases):
```json
{ "error": true, "message": "Location not found" }
```
Status codes:
- 200 OK – success
- 201 Created – new location or favorite
- 400 Bad Request – malformed input (e.g. missing required fields)
- 404 Not Found – location / forecast unavailable
- 409 Conflict – duplicate location name
- 500 Internal Server Error – unexpected failure

Examples:
Duplicate location:
```json
{ "error": true, "message": "Location already exists" }
```
Unknown forecast date:
```json
{ "error": true, "message": "No forecast data for this date" }
```
Invalid date:
```json
{ "error": true, "message": "Invalid date format (use YYYY-MM-DD)" }
```

## Demo Video
[Demo Video](https://drive.google.com/file/d/1batxtUkie57KHrJ3pc9SZ_lD8twMP0a4/view?usp=drive_link)

## References
- https://open-meteo.com/
- https://sequelize.org/
- https://react.dev/

- https://vitejs.dev/
