import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './layout.css';

export default function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-logo">
            <Link to="/">🌤️ Weather Forecast</Link>
          </h1>
          <nav className="app-nav">
            <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
              Home
            </Link>
            <Link to="/locations" className={isActive('/locations') ? 'nav-link active' : 'nav-link'}>
              Locations
            </Link>
            <Link to="/favorites" className={isActive('/favorites') ? 'nav-link active' : 'nav-link'}>
              Favorites
            </Link>
          </nav>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>Weather Forecast App © 2025</p>
      </footer>
    </div>
  );
}
