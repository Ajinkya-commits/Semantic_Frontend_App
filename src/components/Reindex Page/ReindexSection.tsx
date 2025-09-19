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
      <div className="reindex-actions">
        <button
          onClick={onStartReindex}
          disabled={isReindexing}
          className="search-btn"
        >
          {isReindexing ? 'Reindexing...' : 'Reindex All Entries'}
        </button>
      </div>

      {isReindexing && (
        <div className="progress-container">
          <div
            className={`progress-bar ${reindexProgress === 100 ? 'complete' : ''}`}
            style={{ width: `${reindexProgress}%` }}
          >
            {reindexProgress.toFixed(0)}%
          </div>
          <div className="progress-text">
            {reindexProgress < 100 ? 'Indexing entries...' : 'Indexing completed!'}
          </div>
        </div>
      )}

      {reindexResults && !isReindexing && (
        <div className="reindex-results">
          <div className="reindex-results-header">
            <h4 className="reindex-results-title"> Reindexing Results</h4>
            <button
              onClick={onClearResults}
              className="close-results-btn"
              title="Close"
            >
              ×
            </button>
          </div>
          <div className="reindex-results-grid">
            <div className="reindex-stat">
              <strong>Indexed:</strong> {reindexResults.indexed}
            </div>
            <div className="reindex-stat">
              <strong>Skipped:</strong> {reindexResults.skipped}
            </div>
            <div className="reindex-stat">
              <strong>Errors:</strong> {reindexResults.errors}
            </div>
            <div className="reindex-stat">
              <strong>Total:</strong> {reindexResults.totalProcessed}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
