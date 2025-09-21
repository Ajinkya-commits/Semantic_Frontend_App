import React, { useState } from 'react';
import { ReindexResults } from '../../hooks/useReindex';
import { indexImages } from '../../services/api';
import './ReindexSection.css';

interface ReindexSectionProps {
  isReindexing: boolean;
  progress: number;
  results: ReindexResults | null;
  onReindex: () => void;
  onClearResults: () => void;
}

export const ReindexSection: React.FC<ReindexSectionProps> = ({
  isReindexing,
  progress,
  results,
  onReindex,
  onClearResults,
}) => {
  const [isIndexingImages, setIsIndexingImages] = useState(false);
  const [imageResults, setImageResults] = useState<any>(null);

  const handleImageReindex = async () => {
    setIsIndexingImages(true);
    setImageResults(null);
    
    try {
      const result = await indexImages();
      setImageResults(result);
      console.log('Image indexing completed:', result);
    } catch (error) {
      console.error('Image indexing failed:', error);
      setImageResults({
        success: false,
        message: 'Failed to index images',
        indexed: 0,
        total: 0
      });
    } finally {
      setIsIndexingImages(false);
    }
  };

  return (
    <>
      <div className="reindex-actions">
        <button
          onClick={onReindex}
          disabled={isReindexing || isIndexingImages}
          className="search-btn"
        >
          {isReindexing ? 'Reindexing...' : 'Reindex Text Entries'}
        </button>
        
        <button
          onClick={handleImageReindex}
          disabled={isReindexing || isIndexingImages}
          className="search-btn"
          style={{ marginLeft: '10px' }}
        >
          {isIndexingImages ? 'Indexing Images...' : 'Index All Images'}
        </button>
      </div>

      {isReindexing && (
        <div className="progress-container">
          <div
            className={`progress-bar ${progress === 100 ? 'complete' : ''}`}
            style={{ width: `${progress}%` }}
          >
            {progress.toFixed(0)}%
          </div>
          <div className="progress-text">
            {progress < 100 ? 'Indexing text entries...' : 'Text indexing completed!'}
          </div>
        </div>
      )}

      {isIndexingImages && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: '100%', background: '#4CAF50' }}>
            Processing Images...
          </div>
          <div className="progress-text">
            Generating embeddings for images...
          </div>
        </div>
      )}

      {imageResults && !isIndexingImages && (
        <div className="reindex-results">
          <div className="reindex-results-header">
            <h4 className="reindex-results-title">Image Indexing Results</h4>
            <button
              onClick={() => setImageResults(null)}
              className="clear-results-btn"
            >
              Clear
            </button>
          </div>
          <div className="reindex-results-content">
            <div className="result-item">
              <span className="result-label">Status:</span>
              <span className={`result-value ${imageResults.success ? 'success' : 'error'}`}>
                {imageResults.success ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Images Indexed:</span>
              <span className="result-value">{imageResults.indexed || 0}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Images:</span>
              <span className="result-value">{imageResults.total || 0}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Message:</span>
              <span className="result-value">{imageResults.message}</span>
            </div>
          </div>
        </div>
      )}

      {results && !isReindexing && (
        <div className="reindex-results">
          <div className="reindex-results-header">
            <h4 className="reindex-results-title">Text Reindexing Results</h4>
            <button
              onClick={onClearResults}
              className="clear-results-btn"
            >
              Clear
            </button>
          </div>
          <div className="reindex-results-content">
            <div className="result-item">
              <span className="result-label">Status:</span>
              <span className={`result-value ${results.success ? 'success' : 'error'}`}>
                {results.success ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Message:</span>
              <span className="result-value">{results.message}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
