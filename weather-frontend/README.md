# Weather Forecast Application - Frontend

A React-based weather forecast application built with Vite, featuring location search, forecast visualization, and favorites management.

## 🚀 Tech Stack

- **React** (Vite, JavaScript)
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Chart.js + react-chartjs-2** - Data visualization
- **React Hook Form + Yup** - Form validation
- **Normal CSS** - Styling (NO Tailwind)

## 📂 Project Structure

```
src/
├── App.jsx                     # Main app with routing
├── main.jsx                    # Entry point
├── assets/                     # Static assets
├── styles/
│   └── index.css              # Global styles
├── utils/
│   ├── date.js                # Date formatting helpers
│   └── chartHelpers.js        # Chart data builders
├── services/
│   └── api.js                 # API service layer (axios)
├── hooks/
│   └── useFetch.js            # Custom fetch hook with caching
├── context/
│   └── FavoritesContext.jsx   # Favorites state management
├── components/
│   └── ui/
│       ├── Button.jsx
│       ├── TextInput.jsx
│       ├── DatePicker.jsx
│       ├── Loader.jsx
│       ├── ErrorBanner.jsx
│       ├── LocationCard.jsx
│       ├── ForecastSummary.jsx
│       ├── LineChart.jsx
│       └── PieChart.jsx
└── pages/
    ├── Home.jsx               # Location search form
    ├── Forecast.jsx           # Weather display with charts
    ├── Favorites.jsx          # Saved favorites list
    └── Locations.jsx          # Saved locations list
```

## ⚙️ Setup

### 1. Install Dependencies

All dependencies are already in `package.json`:

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

> Replace `http://localhost:5000` with your actual backend API URL.

### 3. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy).

## 🎯 Features

### Home Page (`/`)
- Location search form with validation
- Date picker for forecast date
- "Check Forecast" button - fetches and navigates to forecast
- "Save Location" button - saves location to backend

### Forecast Page (`/forecast`)
- **Weather Summary Card** - temp, condition, humidity, wind, UV
- **Hourly Temperature Line Chart** - smooth line with tooltips showing time + temp + condition
- **Condition Distribution Pie Chart** - counts of each weather condition
- **Hourly Details Table** - complete hourly breakdown
- **Add to Favorites** button

### Favorites Page (`/favorites`)
- Lists all saved favorite locations
- Each card has "View Forecast" button

### Locations Page (`/locations`)
- Lists all saved locations from backend

## 📡 API Integration

All API calls use `axios` with the base URL from `VITE_API_BASE_URL`:

```javascript
// services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});
```

### API Endpoints Used

- `GET /api/forecast?location=<name>&date=<date>` - Get forecast
- `POST /api/locations` - Save location
- `GET /api/locations/:id` - Get location by ID
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add to favorites

## 📊 Charts

### Line Chart (Hourly Temperature)
- X-axis: Hours (06:00, 07:00...)
- Y-axis: Temperature °C
- Smooth line, no fill
- Custom tooltip: shows time + temp + condition

### Pie Chart (Condition Distribution)
- Labels: condition types (sunny, cloudy, rainy)
- Values: count of hours matching each condition
- Auto-generated colors

## 🎨 Styling

All styles are in `src/styles/index.css`:

- Global reset
- `.container` - max-width 1100px
- `.card` - white cards with shadow
- `.button` - standard button styles
- `.input` - form inputs
- `.chart-container` - responsive chart wrapper
- Responsive breakpoints for mobile

## 🔧 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

Preview production build:

```bash
npm run preview
```

## 🧪 Form Validation

Uses **react-hook-form** + **Yup** for validation:

- Location name: required
- Date: required, must be valid date

Error messages appear inline below form fields.

## 💾 LocalStorage Fallback

The app uses `localStorage` as a fallback cache:

- Favorites are cached locally if API fails
- Forecast data can be cached with `cacheKey` option in `useFetch`

## 🚦 Loading & Error States

- **Loader** component shows during async operations
- **ErrorBanner** component displays errors
- All pages handle loading and error states gracefully

## 📝 Notes

- NO TypeScript
- NO Tailwind CSS
- Uses normal CSS only
- React Hook Form for forms
- Chart.js for visualizations
- Context API for favorites state
- React Router for navigation

## 🐛 Troubleshooting

### API Connection Issues
1. Verify `.env` file exists with correct `VITE_API_BASE_URL`
2. Ensure backend is running
3. Check browser console for CORS errors

### Charts Not Displaying
1. Ensure `chart.js` and `react-chartjs-2` are installed
2. Check that hourly data format matches expected structure

### Build Errors
1. Run `npm install` to ensure all dependencies are installed
2. Check for any ESLint errors: `npm run lint`

---

**Created**: November 2025  
**Framework**: React + Vite  
**License**: MIT
