import React from 'react';
import { ReindexResults } from '../../hooks/useReindex';
import './ReindexSection.css';

interface ReindexSectionProps {
  isReindexing: boolean;
  reindexProgress: number;
  reindexResults: ReindexResults | null;
  onStartReindex: () => void;
  onClearResults: () => void;
}

export const ReindexSection: React.FC<ReindexSectionProps> = ({
  isReindexing,
  reindexProgress,
  reindexResults,
  onStartReindex,
  onClearResults,
}) => {
  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          onClick={onStartReindex}
          disabled={isReindexing}
          className="search-btn"
        >
          {isReindexing ? 'Reindexing...' : 'Reindex All Entries'}
        </button>
      </div>

      {isReindexing && (
        <div
          className="progress-container"
          style={{
            marginTop: '16px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid #ddd',
          }}
        >
          <div
            className="progress-bar"
            style={{
              width: `${reindexProgress}%`,
              height: '24px',
              backgroundColor: reindexProgress === 100 ? '#4CAF50' : '#2196F3',
              transition: 'width 0.3s ease, background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            {reindexProgress.toFixed(0)}%
          </div>
          <div
            style={{
              padding: '8px',
              fontSize: '12px',
              color: '#666',
              textAlign: 'center',
            }}
          >
            {reindexProgress < 100 ? 'Indexing entries...' : 'Indexing completed!'}
          </div>
        </div>
      )}

      {reindexResults && !isReindexing && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#e8f5e8',
            borderRadius: '4px',
            border: '1px solid #4CAF50',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <h4 style={{ margin: '0', color: '#2e7d32' }}> Reindexing Results</h4>
            <button
              onClick={onClearResults}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#2e7d32',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close"
            >
              ×
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '8px',
              fontSize: '14px',
            }}
          >
            <div>
              <strong>Indexed:</strong> {reindexResults.indexed}
            </div>
            <div>
              <strong>Skipped:</strong> {reindexResults.skipped}
            </div>
            <div>
              <strong>Errors:</strong> {reindexResults.errors}
            </div>
            <div>
              <strong>Total:</strong> {reindexResults.totalProcessed}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
