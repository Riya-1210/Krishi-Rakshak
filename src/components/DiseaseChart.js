/**
 * Disease Chart Component
 * ======================
 * Displays disease statistics as pie or bar charts
 */

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function DiseaseChart({ data, type }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="chart-empty">
        <p>No data available</p>
      </div>
    );
  }

  // Prepare chart data
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Color palette
  const colors = [
    '#2E7D32', // Green
    '#1976D2', // Blue
    '#FF9800', // Orange
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FF5722', // Deep Orange
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#4CAF50', // Light Green
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Count',
        data: values,
        backgroundColor: type === 'pie' 
          ? colors.slice(0, labels.length)
          : colors[0],
        borderColor: type === 'pie'
          ? colors.slice(0, labels.length).map(c => c)
          : colors[0],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'pie' ? 'right' : 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: type === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    } : undefined,
  };

  return (
    <div className="chart-wrapper">
      {type === 'pie' ? (
        <Pie data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}

export default DiseaseChart;

