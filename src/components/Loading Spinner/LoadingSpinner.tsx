import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '🔍 Searching...', 
  size = 'medium' 
}) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner-content">
        <div className={`loading-spinner ${size}`}></div>
        <p className={`loading-spinner-message ${size}`}>{message}</p>
      </div>
    </div>
  );
};
