// src/pages/Favorites.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useFavorites } from '../context/useFavorites';
import { formatDateInput } from '../utils/date';

export default function Favorites() {
  const { favorites, loading, error } = useFavorites();
  const nav = useNavigate();

  const handleView = (location) => {
    nav('/forecast', {
      state: {
        locationName: location.name,
        date: formatDateInput(new Date())
      }
    });
  };

  if (loading) return <Layout><div className="loader"><div className="spinner"></div></div></Layout>;

  return (
    <Layout>
      <div className="mb-3">
        <h2>⭐ Favorite Locations</h2>
        <p className="text-secondary">Your saved locations for quick access</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {favorites.length === 0 ? (
        <div className="card text-center">
          <div className="card-body">
            <h3>No favorites yet</h3>
            <p className="text-secondary mb-2">Add locations to favorites from the forecast page</p>
            <button className="button primary" onClick={() => nav('/')}>Search Weather</button>
          </div>
        </div>
      ) : (
        <div className="grid cards">
          {favorites.map((location) => (
            <div key={location.id || location.name} className="card">
              <div className="card-header">
                <h3 className="card-title">{location.name}</h3>
                <p className="card-subtitle">
                  {location.latitude && location.longitude
                    ? `${Number(location.latitude).toFixed(2)}°, ${Number(location.longitude).toFixed(2)}°`
                    : 'Coordinates unavailable'}
                </p>
              </div>
              <div className="card-body">
                {location.altitude && <p className="text-secondary">Altitude: {location.altitude}m</p>}
              </div>
              <div className="card-actions">
                <button className="button primary" onClick={() => handleView(location)}>
                  View Forecast
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
