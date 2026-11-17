/**
 * Stats Card Component
 * ====================
 * Displays a statistic with icon, title, and value
 */

import React from 'react';

function StatsCard({ title, value, icon, color }) {
  return (
    <div className="stats-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value" style={{ color: color }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

export default StatsCard;

