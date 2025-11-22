// src/components/ui/ForecastSummary.jsx
import React from 'react';

export default function ForecastSummary({ summary = {} }) {
  const { temp_c, condition, humidity, wind_kph, uv } = summary;
  return (
    <div className="card summary">
      <div className="card-body">
        <h3>Weather Summary</h3>
        <div className="summary-grid">
          <div><strong>Temp:</strong> {temp_c ?? summary.temp ?? '-'} °C</div>
          <div><strong>Condition:</strong> {condition?.text || condition || '-'}</div>
          <div><strong>Humidity:</strong> {humidity ?? '-'}%</div>
          <div><strong>Wind:</strong> {wind_kph ?? summary.wind_kph ?? '-'} kph</div>
          <div><strong>UV:</strong> {uv ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}
