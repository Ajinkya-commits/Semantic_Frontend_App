import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '🔍 Searching...', 
  size = 'medium' 
}) => {
  const sizeMap = {
    small: { spinner: '24px', fontSize: '14px', padding: '20px' },
    medium: { spinner: '40px', fontSize: '16px', padding: '40px' },
    large: { spinner: '60px', fontSize: '18px', padding: '60px' }
  };

  const { spinner, fontSize, padding } = sizeMap[size];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        color: '#666',
      }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: spinner,
            height: spinner,
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}></div>
        <p style={{ margin: 0, fontSize }}>{message}</p>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
