// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { formatDateInput } from '../utils/date';

export default function Home() {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('');
  const [date, setDate] = useState(() => formatDateInput(new Date()));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!locationName || !date) return;

    navigate('/forecast', {
      state: { locationName, date }
    });
  };

  return (
    <Layout>
      <div className="hero">
        <h1>Weather Forecast</h1>
        <p>Get accurate weather forecasts for any location worldwide</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header">
          <h2 className="card-title">Search Weather</h2>
          <p className="card-subtitle">Enter a city name and date to view forecast</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter city name (e.g., Mumbai, Bengaluru)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button primary" style={{ width: '100%' }}>
            Get Forecast
          </button>
        </form>
      </div>

      <div className="grid three mt-4 home-links">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📍 Locations</h3>
          </div>
          <p className="text-secondary">Manage your saved locations and quick add new ones</p>
          <button className="button secondary mt-2" onClick={() => navigate('/locations')}>
            View Locations
          </button>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">⭐ Favorites</h3>
          </div>
          <p className="text-secondary">Access your favorite locations for quick weather checks</p>
          <button className="button secondary mt-2" onClick={() => navigate('/favorites')}>
            View Favorites
          </button>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🌡️ Features</h3>
          </div>
          <p className="text-secondary">Hourly forecasts, detailed stats, and weather conditions</p>
        </div>
      </div>
    </Layout>
  );
}
