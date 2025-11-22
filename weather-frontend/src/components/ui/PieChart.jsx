// src/components/ui/PieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ chartData }) {
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No condition data available</div>;
  }
  const data = {
    labels: chartData.labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        data: chartData.data,
        backgroundColor: chartData.colors,
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f1f5f9',
          padding: 10,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
  };
  return (
    <div className="chart-container">
      <Pie data={data} options={options} />
    </div>
  );
}
