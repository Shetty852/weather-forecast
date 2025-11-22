// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Favorites from './pages/Favorites';
import Locations from './pages/Locations';
import { FavoritesProvider } from './context/FavoritesContext';
import './components/Layout.css';

export default function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/locations" element={<Locations />} />
      </Routes>
    </FavoritesProvider>
  );
}
