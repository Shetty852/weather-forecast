// src/pages/Forecast.jsx
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import useFetch from '../hooks/useFetch';
import * as api from '../services/api';
import ErrorBanner from '../components/ui/ErrorBanner';
import LineChart from '../components/ui/LineChart';
import PieChart from '../components/ui/PieChart';
import { buildLineChartData, buildPieChartData } from '../utils/chartHelpers';
import { formatDateInput } from '../utils/date';
import { useFavorites } from '../context/useFavorites';

export default function Forecast() {
  const nav = useNavigate();
  const location = useLocation();
  const state = location.state ?? {};
  const requestedName = state.locationName ?? '';
  const requestedDate = formatDateInput(state.date ?? '');

  const fetchForecast = async () => {
    if (!requestedName || !requestedDate) {
      throw new Error('Missing location or date');
    }
    return api.getForecast({ locationName: requestedName, date: requestedDate });
  };

  const { data, loading, error } = useFetch(fetchForecast, [requestedName, requestedDate], {
    cacheKey: `forecast:${requestedName}:${requestedDate}`
  });
  const { addFavorite } = useFavorites();

  const hourly = useMemo(() => data?.hourly ?? [], [data]);
  const locationLabel = data?.location?.name ?? requestedName;
  const lineData = useMemo(() => buildLineChartData(hourly), [hourly]);
  const pieData = useMemo(() => buildPieChartData(hourly), [hourly]);

  const handleAddFavorite = async () => {
    const existingId = data?.location?.id;
    const name = locationLabel;

    try {
      let locationId = existingId;

      if (!locationId) {
        // fall back to quick add so we get an id
        const created = await api.quickAddLocation(name);
        locationId = created?.location?.id;
      }

      if (!locationId) throw new Error('Missing location id');

      await addFavorite(locationId);
      alert('Added to favorites');
    } catch (err) {
      console.error(err);
      alert('Could not add favorite');
    }
  };

  const averageTemperature = hourly.length
    ? (hourly.reduce((sum, entry) => sum + (entry.temp_c ?? entry.tempC ?? 0), 0) / hourly.length).toFixed(1)
    : null;

  const averageHumidity = hourly.length
    ? Math.round(hourly.reduce((sum, entry) => sum + (entry.humidity ?? 0), 0) / hourly.length)
    : null;

  const maxUv = hourly.length ? Math.max(...hourly.map(entry => entry.uv ?? 0)) : null;

  if (loading) return <Layout><div className="loader"><div className="spinner"></div></div></Layout>;
  if (error) return <Layout><ErrorBanner message={error} /></Layout>;

  return (
    <Layout>
      <div className="mb-3">
        <h2>{locationLabel}</h2>
        <p className="text-secondary">{requestedDate}</p>
      </div>

      <div className="stats mb-3">
        <div className="stat-card">
          <div className="stat-label">Avg Temperature</div>
          <div className="stat-value">{averageTemperature}°C</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Humidity</div>
          <div className="stat-value">{averageHumidity}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Max UV Index</div>
          <div className="stat-value">{maxUv}</div>
        </div>
      </div>

      <div className="card-actions mb-3">
        <button className="button primary" onClick={handleAddFavorite}>⭐ Add to Favorites</button>
        <button className="button secondary" onClick={() => nav('/')}>← Back to Search</button>
      </div>

      <div className="grid two">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📈 Temperature Trend</h3>
          </div>
          <div className="card-body">
            <LineChart chartData={lineData} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">☁️ Conditions</h3>
          </div>
          <div className="card-body">
            <PieChart chartData={pieData} />
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">
          <h3 className="card-title">🕒 Hourly Forecast</h3>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Temp (°C)</th>
                <th>Condition</th>
                <th>Humidity (%)</th>
                <th>Wind (kph)</th>
                <th>UV Index</th>
              </tr>
            </thead>
            <tbody>
              {hourly.map((entry, index) => (
                <tr key={`hour-${entry.hour ?? index}-${index}`}>
                  <td>{new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td><strong>{entry.temp_c ?? entry.tempC ?? '-'}</strong></td>
                  <td>{entry.condition?.text ?? entry.condition ?? '-'}</td>
                  <td>{entry.humidity ?? '-'}</td>
                  <td>{entry.wind_kph ?? entry.windKph ?? '-'}</td>
                  <td>{entry.uv ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
