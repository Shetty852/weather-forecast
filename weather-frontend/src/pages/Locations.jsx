// src/pages/Locations.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import * as api from '../services/api';
import AddLocationForm from '../components/ui/AddLocationForm';
import { formatDateInput } from '../utils/date';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function fetchLocations() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getLocations();
        if (!cancelled) {
          setLocations(response ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLocations();
    return () => { cancelled = true; }; // drop updates if component unmounts
  }, []);

  const handleCreated = (location) => {
    // keep list alpha-sorted
    setLocations((prev) => [...prev, location].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleViewForecast = (location) => {
    nav('/forecast', {
      state: {
        locationName: location.name,
        date: formatDateInput(new Date())
      }
    });
  };

  return (
    <Layout>
      <div className="mb-3">
        <h2>📍 Manage Locations</h2>
        <p className="text-secondary">Add and view all saved locations</p>
      </div>

      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title">Add New Location</h3>
        </div>
        <div className="card-body">
          <AddLocationForm onCreated={handleCreated} />
        </div>
      </div>

      {loading && <div className="loader"><div className="spinner"></div></div>}
      {error && <div className="error-banner">{error}</div>}

      <div className="grid cards">
        {locations.map((l) => (
          <div key={l.id || l.name} className="card">
            <div className="card-header">
              <h3 className="card-title">{l.name}</h3>
              <p className="card-subtitle">
                {l.latitude && l.longitude
                  ? `${Number(l.latitude).toFixed(2)}°, ${Number(l.longitude).toFixed(2)}°`
                  : 'Coordinates unavailable'}
              </p>
            </div>
            <div className="card-body">
              {l.altitude && <p className="text-secondary">Altitude: {l.altitude}m</p>}
            </div>
            <div className="card-actions">
              <button className="button primary" onClick={() => handleViewForecast(l)}>
                View Forecast
              </button>
            </div>
          </div>
        ))}
      </div>
      {!loading && locations.length === 0 && (
        <div className="card text-center">
          <p className="text-secondary">No locations saved yet. Add one above!</p>
        </div>
      )}
    </Layout>
  );
}
