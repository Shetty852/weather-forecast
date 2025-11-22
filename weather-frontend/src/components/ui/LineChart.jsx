// src/components/ui/LineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineChart({ chartData }) {
  if (!chartData) return null;
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const idx = context.dataIndex;
            const temp = context.parsed.y;
            const cond = chartData.meta?.conditions?.[idx] || '';
            return `${temp} °C — ${cond}`;
          },
        },
      },
    },
    scales: {
      y: { title: { display: true, text: '°C' } },
      x: { title: { display: true, text: 'Hour' } },
    },
  };

  return (
    <div className="chart-container">
      <Line data={{ labels: chartData.labels, datasets: chartData.datasets }} options={options} />
    </div>
  );
}
