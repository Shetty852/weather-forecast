// src/context/FavoritesContext.jsx
import React, { useEffect, useState } from 'react';
import * as api from '../services/api';
import { FavoritesContext } from './favoritesStore';

const emptyList = [];

const readCache = () => {
  try {
    const raw = localStorage.getItem('favorites');
    return raw ? JSON.parse(raw) : emptyList;
  } catch {
    return emptyList;
  }
};

const tidyFavorites = (items) => (items ?? emptyList).map(item => item.location ?? item);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readCache());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const pullFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const fresh = tidyFavorites(await api.getFavorites());
        if (!cancelled) {
          setFavorites(fresh);
          // keep local copy for quick loads
          localStorage.setItem('favorites', JSON.stringify(fresh));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    pullFavorites();
    return () => { cancelled = true; };
  }, []);

  const addFavorite = async (location) => {
    setError(null);

    const id = typeof location === 'number'
      ? location
      : (location?.id ?? location?.locationId ?? location?.location?.id);

    if (!id) {
      setError('Invalid location for favorite');
      return;
    }

    try {
      await api.addFavorite(id);
      const fresh = tidyFavorites(await api.getFavorites());
      setFavorites(fresh);
      localStorage.setItem('favorites', JSON.stringify(fresh));
    } catch (err) {
      setError(err.message ?? String(err));
      throw err;
    }
  };

  const contextValue = { favorites, addFavorite, loading, error };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}
