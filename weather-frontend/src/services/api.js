// src/services/api.js
import axios from 'axios';

const fallbackBase = 'http://localhost:5000';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim() !== ''
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : fallbackBase,
});

export async function getForecast({ locationName, date }) {
  const params = { location: locationName, date };
  try {
    const res = await api.get('/api/forecast', { params });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to fetch forecast';
    const e = new Error(msg);
    e.status = err?.response?.status;
    throw e;
  }
}

export async function postLocation(data) {
  const res = await api.post('/api/locations', data);
  return res.data;
}

export async function quickAddLocation(name) {
  const res = await api.post('/api/locations/quick', { name });
  return res.data;
}

export async function getLocation(id) {
  const res = await api.get(`/api/locations/${id}`);
  return res.data;
}

export async function getLocations() {
  const res = await api.get('/api/locations');
  return res.data;
}

export async function getFavorites() {
  const res = await api.get('/api/favorites');
  return res.data;
}

export async function addFavorite(locationId) {
  const res = await api.post('/api/favorites', { locationId });
  return res.data;
}

export default api;
