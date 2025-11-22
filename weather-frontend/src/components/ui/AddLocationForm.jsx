import React, { useState } from 'react';
import { quickAddLocation, postLocation } from '../../services/api';

export default function AddLocationForm({ onCreated }) {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [mode, setMode] = useState('quick'); // quick | full
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      let res;
      if (mode === 'quick') {
        res = await quickAddLocation(name.trim());
      } else {
        const payload = {
          name: name.trim(),
          latitude: latitude !== '' ? parseFloat(latitude) : undefined,
          longitude: longitude !== '' ? parseFloat(longitude) : undefined,
          altitude: altitude !== '' ? parseFloat(altitude) : undefined,
        };
        res = await postLocation(payload);
      }
      setName(''); setLatitude(''); setLongitude(''); setAltitude('');
      if (onCreated) onCreated(res.location);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add location';
      if (err.response?.status === 409) {
        setError('This location already exists');
      } else {
        setError(msg);
      }
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Mode</label>
        <select className="form-select" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="quick">Quick (name only + auto geocode)</option>
          <option value="full">Full (provide coordinates)</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Location Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Udupi"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      {mode === 'full' && (
        <>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input
              type="number"
              step="0.000001"
              className="form-input"
              placeholder="e.g., 13.3347"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input
              type="number"
              step="0.000001"
              className="form-input"
              placeholder="e.g., 74.7462"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Altitude (m)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="e.g., 30"
              value={altitude}
              onChange={e => setAltitude(e.target.value)}
            />
          </div>
        </>
      )}
      <button type="submit" disabled={loading || !name.trim()} className="button primary">
        {loading ? 'Adding...' : 'Add Location'}
      </button>
      {error && <div className="error-banner mt-2">{error}</div>}
    </form>
  );
}
