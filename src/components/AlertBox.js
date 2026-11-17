/**
 * Alert Box Component
 * ====================
 * Displays disease outbreak alerts with severity indicators
 */

import React from 'react';

function AlertBox({ alert }) {
  const { type, severity, disease, count, message } = alert;

  // Determine alert style based on severity
  const getAlertStyle = () => {
    switch (severity) {
      case 'high':
        return 'alert-high';
      case 'medium':
        return 'alert-medium';
      case 'low':
        return 'alert-low';
      default:
        return 'alert-default';
    }
  };

  // Get icon based on alert type
  const getAlertIcon = () => {
    switch (type) {
      case 'outbreak_warning':
        return '⚠️';
      case 'positive_trend':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`alert-box ${getAlertStyle()}`}>
      <div className="alert-header">
        <span className="alert-icon">{getAlertIcon()}</span>
        <span className={`alert-severity severity-${severity}`}>
          {severity?.toUpperCase() || 'INFO'}
        </span>
      </div>
      
      <div className="alert-content">
        <h4 className="alert-title">{disease}</h4>
        <p className="alert-message">{message}</p>
        
        {count && (
          <div className="alert-count">
            <span className="count-label">Cases:</span>
            <span className="count-value">{count}</span>
          </div>
        )}
      </div>
      
      <div className="alert-actions">
        <button className="alert-btn">View Details</button>
        <button className="alert-btn-secondary">Dismiss</button>
      </div>
    </div>
  );
}

export default AlertBox;

