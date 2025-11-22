// src/utils/chartHelpers.js
import { formatHourLabel } from './date';

export function buildLineChartData(hourly = []) {
  const labels = hourly.map((h) => formatHourLabel(h.time));
  const temps = hourly.map((h) => h.temp_c ?? h.temp ?? 0);
  const conditions = hourly.map((h) => h.condition ?? h.condition?.text ?? 'Unknown');

  return {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temps,
        fill: false,
        borderColor: '#0077cc',
        tension: 0.3,
        pointRadius: 3,
      },
    ],
    meta: { conditions },
  };
}

export function buildPieChartData(hourly = []) {
  const counts = {};
  hourly.forEach((h) => {
    const c = String(h.condition?.text || h.condition || 'Unknown').toLowerCase();
    counts[c] = (counts[c] || 0) + 1;
  });
  const labels = Object.keys(counts);
  const data = labels.map((l) => counts[l]);
  const colors = labels.map((_, i) => `hsl(${(i * 60) % 360} 70% 50%)`);
  return { labels, data, colors };
}
