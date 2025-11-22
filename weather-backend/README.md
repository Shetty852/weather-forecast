# Weather Forecast Backend API

A complete Express.js backend application with MySQL and Sequelize ORM for managing weather forecast data, locations, and user favorites.

## 🚀 Tech Stack

- **Node.js** + **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **Joi** - Input validation
- **Jest** + **Supertest** - Testing
- **Helmet** + **CORS** - Security

## 📂 Project Structure

```
weather-backend/
├── package.json
├── .env.example
├── .sequelizerc
├── index.js                    # Server entry point
├── app.js                      # Express app configuration
├── config/
│   └── database.js            # Sequelize database config
├── models/
│   ├── index.js               # Model initialization & associations
│   ├── location.js            # Location model
│   ├── weatherdata.js         # WeatherData model
│   └── favorite.js            # Favorite model
├── migrations/
│   ├── 20250101000001-create-locations.js
│   ├── 20250101000002-create-weather-data.js
│   └── 20250101000003-create-favorites.js
├── controllers/
│   ├── forecastController.js  # Forecast endpoint logic
│   ├── locationController.js  # Location CRUD
│   └── favoriteController.js  # Favorites management
├── routes/
│   ├── index.js               # Route aggregator
│   ├── forecast.js            # Forecast routes
│   ├── locations.js           # Location routes
│   └── favorites.js           # Favorite routes
├── services/
│   └── forecastService.js     # Business logic for forecasts
├── middlewares/
│   ├── errorHandler.js        # Global error handler
│   └── validateRequest.js     # Joi validation middleware
├── utils/
│   └── dateUtils.js           # Date helper functions
├── scripts/
│   └── seed.js                # Database seeder
└── tests/
    └── forecast.test.js       # API tests
```

## ⚙️ Installation

### 1. Install Dependencies

```bash
npm install
```

**Runtime dependencies:**
```bash
npm install express cors dotenv sequelize mysql2 joi helmet
```

**Dev dependencies:**
```bash
npm install -D nodemon jest supertest sequelize-cli
```

### 2. Install Sequelize CLI Globally (Optional)

```bash
npm install -g sequelize-cli
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=weatherdb
DB_USER=root
DB_PASS=yourpassword
NODE_ENV=development
```

### 4. Create MySQL Database

Login to MySQL and create the database:

```sql
CREATE DATABASE weatherdb;
```

Or via command line:

```bash
mysql -u root -p -e "CREATE DATABASE weatherdb;"
```

### 5. Run Migrations

```bash
npm run migrate
```

This will create the following tables:
- `locations` - Store location data
- `weather_data` - Store hourly weather forecasts
- `favorites` - Store user favorite locations

### 6. Seed Database

```bash
npm run seed
```

This will insert:
- 2 demo locations (Mumbai, Bengaluru)
- 24 hourly weather records for each location (date: 2025-11-19)
- 1 favorite entry

## 🏃 Running the Server

### Development Mode (with nodemon)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:5000` (or the PORT specified in `.env`)

### Health Check

```
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-19T10:30:00.000Z"
}
```

## 📡 API Endpoints

### 1. Get Weather Forecast

**Endpoint:** `GET /api/forecast`

**Query Parameters:**
- `location` (required) - Location name (string) or ID (number)
- `date` (required) - Date in YYYY-MM-DD format

**Example Request:**
```bash
GET http://localhost:5000/api/forecast?location=Mumbai&date=2025-11-19
```

**Example Response (200 OK):**
```json
{
  "date": "2025-11-19",
  "location": {
    "id": 1,
    "name": "Mumbai",
    "latitude": 19.076,
    "longitude": 72.8777,
    "altitude": 14
  },
  "hourly": [
    {
      "time": "2025-11-19T00:00:00.000Z",
      "hour": 0,
      "tempC": 24.5,
      "temp_c": 24.5,
      "condition": "clear",
      "humidity": 78,
      "windKph": 12.5,
      "wind_kph": 12.5,
      "uv": 0
    },
    {
      "time": "2025-11-19T01:00:00.000Z",
      "hour": 1,
      "tempC": 24.2,
      "temp_c": 24.2,
      "condition": "cloudy",
      "humidity": 80,
      "windKph": 11.0,
      "wind_kph": 11.0,
      "uv": 0
    }
    // ... 22 more hourly records
  ]
}
```

**Error Responses:**

404 Not Found (Location):
```json
{
  "error": true,
  "message": "Location not found"
}
```

### 2. Create Location

**Endpoint:** `POST /api/locations`

**Request Body:**
```json
{
  "name": "Delhi",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "altitude": 216
}
```

**Example Response (201 Created):**
```json
{
  "message": "Location created successfully",
  "location": {
    "id": 3,
    "name": "Delhi",
    "latitude": "28.704100",
    "longitude": "77.102500",
    "altitude": "216.00",
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
  }
}
```

---

### 3. Quick Create Location

**Endpoint:** `POST /api/locations/quick`

**Description:** Quick-create a location by name only. The backend will attempt to geocode and fill latitude/longitude automatically.

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/locations/quick -H "Content-Type: application/json" -d '{"name":"Udupi"}'
```

**Response:**
This will auto-geocode (Open-Meteo) and insert the location with resolved coordinates.

Automatic geocoding can be disabled by setting `AUTO_GEOCODE=false` in environment variables.

If you receive `{"error":true,"message":"Route not found"}` ensure:
- You are using `POST` (GET is not supported for quick create).
- Base URL is correct (e.g. `http://localhost:5000`). Frontend falls back to this if `VITE_API_BASE_URL` is unset.
- Path includes `/api` prefix.

---
404 Not Found (No Data):
```json
{
  "error": true,
  "message": "No forecast data available for this date"
}
```

400 Bad Request:
```json
{
  "error": true,
  "message": "Validation failed",
  "details": [
    {
      "field": "date",
      "message": "\"date\" is required"
    }
  ]
}
```

---

### 2. Create Location

**Endpoint:** `POST /api/locations`

**Request Body:**
```json
{
  "name": "Delhi",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "altitude": 216
}
```

**Example Response (201 Created):**
```json
{
  "message": "Location created successfully",
  "location": {
    "id": 3,
    "name": "Delhi",
    "latitude": "28.704100",
    "longitude": "77.102500",
    "altitude": "216.00",
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
  }
}
```

---

### 3. Get Location by ID

**Endpoint:** `GET /api/locations/:id`

**Example Request:**
```bash
GET http://localhost:5000/api/locations/1
```

**Example Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mumbai",
  "latitude": "19.076000",
  "longitude": "72.877700",
  "altitude": "14.00",
  "createdAt": "2025-11-19T10:00:00.000Z",
  "updatedAt": "2025-11-19T10:00:00.000Z"
}
```

---

### 4. Get All Locations

**Endpoint:** `GET /api/locations`

**Example Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Mumbai",
    "latitude": "19.076000",
    "longitude": "72.877700",
    "altitude": "14.00",
    "createdAt": "2025-11-19T10:00:00.000Z",
    "updatedAt": "2025-11-19T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Bengaluru",
    "latitude": "12.971600",
    "longitude": "77.594600",
    "altitude": "920.00",
    "createdAt": "2025-11-19T10:00:00.000Z",
    "updatedAt": "2025-11-19T10:00:00.000Z"
  }
]
```

---

### 5. Get All Favorites

**Endpoint:** `GET /api/favorites`

**Example Response (200 OK):**
```json
[
  {
    "id": 1,
    "locationId": 1,
    "createdAt": "2025-11-19T10:00:00.000Z",
    "updatedAt": "2025-11-19T10:00:00.000Z",
    "location": {
      "id": 1,
      "name": "Mumbai",
      "latitude": "19.076000",
      "longitude": "72.877700",
      "altitude": "14.00"
    }
  }
]
```

---

### 6. Add Location to Favorites

**Endpoint:** `POST /api/favorites`

**Request Body:**
```json
{
  "locationId": 2
}
```

**Example Response (201 Created):**
```json
{
  "message": "Location added to favorites",
  "favorite": {
    "id": 2,
    "locationId": 2,
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z",
    "location": {
      "id": 2,
      "name": "Bengaluru",
      "latitude": "12.971600",
      "longitude": "77.594600",
      "altitude": "920.00"
    }
  }
}
```

**If already favorited (200 OK):**
```json
{
  "message": "Location is already in favorites",
  "favorite": {
    "id": 2,
    "locationId": 2,
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
  }
}
```

---

## 🗄️ Database Models

### Location
| Field     | Type           | Constraints           |
|-----------|----------------|-----------------------|
| id        | INTEGER        | PK, AUTO_INCREMENT    |
| name      | STRING         | NOT NULL              |
| latitude  | DECIMAL(10,6)  | NULLABLE              |
| longitude | DECIMAL(10,6)  | NULLABLE              |
| altitude  | DECIMAL(10,2)  | NULLABLE              |
| createdAt | DATE           | AUTO                  |
| updatedAt | DATE           | AUTO                  |

### WeatherData
| Field      | Type       | Constraints                              |
|------------|------------|------------------------------------------|
| id         | INTEGER    | PK, AUTO_INCREMENT                       |
| locationId | INTEGER    | FK -> Location.id, NOT NULL              |
| date       | DATEONLY   | NOT NULL                                 |
| hour       | INTEGER    | NOT NULL (0-23)                          |
| tempC      | FLOAT      | NULLABLE                                 |
| condition  | STRING     | NULLABLE                                 |
| humidity   | INTEGER    | NULLABLE                                 |
| windKph    | FLOAT      | NULLABLE                                 |
| uv         | FLOAT      | NULLABLE                                 |
| createdAt  | DATE       | AUTO                                     |
| updatedAt  | DATE       | AUTO                                     |
| **UNIQUE** | -          | (locationId, date, hour)                 |

### Favorite
| Field      | Type    | Constraints              |
|------------|---------|--------------------------|
| id         | INTEGER | PK, AUTO_INCREMENT       |
| locationId | INTEGER | FK -> Location.id        |
| createdAt  | DATE    | AUTO                     |
| updatedAt  | DATE    | AUTO                     |

---

## 🧪 Testing

Run tests with Jest:

```bash
npm test
```

Tests include:
- ✅ GET /api/forecast with valid parameters
- ✅ GET /api/forecast with invalid location (404)
- ✅ GET /api/forecast with no data for date (404)
- ✅ GET /api/forecast with missing parameters (400)
- ✅ POST /api/locations to create new location
- ✅ GET /api/locations/:id to fetch location
- ✅ GET /api/favorites to list favorites
- ✅ POST /api/favorites to add favorite

---

## 🔒 Security Features

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **Joi Validation** - Input validation
- ✅ **Sequelize** - Protection against SQL injection
- ✅ **Error Handler** - Consistent error responses

---

## 📝 Available Scripts

| Script         | Command                 | Description                          |
|----------------|-------------------------|--------------------------------------|
| `npm start`    | `node index.js`         | Start production server              |
| `npm run dev`  | `nodemon index.js`      | Start development server with reload |
| `npm run migrate` | `sequelize db:migrate` | Run database migrations           |
| `npm run seed` | `node scripts/seed.js`  | Seed database with demo data         |
| `npm test`     | `jest --runInBand`      | Run tests sequentially               |

---

## 🐛 Troubleshooting

### Database Connection Error

**Issue:** `Unable to connect to the database`

**Solutions:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check `.env` credentials match MySQL user
3. Ensure database exists: `CREATE DATABASE weatherdb;`
4. Check DB_HOST and DB_PORT in `.env`

### Migration Errors

**Issue:** `ERROR: Table already exists`

**Solution:** Drop and recreate database:
```sql
DROP DATABASE weatherdb;
CREATE DATABASE weatherdb;
```
Then run migrations again: `npm run migrate`

### Port Already in Use

**Issue:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:** Change PORT in `.env` or kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

---

## 📚 Additional Notes

### Sequelize CLI Commands

Generate new migration:
```bash
sequelize migration:generate --name migration-name
```

Undo last migration:
```bash
sequelize db:migrate:undo
```

Undo all migrations:
```bash
sequelize db:migrate:undo:all
```

### Development Tips

1. **Auto-reload**: Use `npm run dev` for automatic server restart on file changes
2. **Logging**: Set `logging: console.log` in `config/database.js` to see SQL queries
3. **Debug**: Use `console.log()` or a debugger like VS Code's built-in debugger

---

## 📄 License

MIT

---

**Created:** November 2025  
**Framework:** Express.js + Sequelize + MySQL  
**Author:** Weather Backend Team
