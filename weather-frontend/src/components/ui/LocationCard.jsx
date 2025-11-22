// src/components/ui/LocationCard.jsx
import React from 'react';

export default function LocationCard({ location, onView }) {
  return (
    <div className="card location-card">
      <div className="card-body">
        <h4>{location.name || location.locationName || location.title}</h4>
        {location.description && <p>{location.description}</p>}
        <div className="card-actions">
          <button className="button" onClick={() => onView && onView(location)}>View Forecast</button>
        </div>
      </div>
    </div>
  );
}
