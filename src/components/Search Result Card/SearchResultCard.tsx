import React from 'react';
import { SearchResult } from '../../types';
import './SearchResultCard.css';

interface SearchResultCardProps {
  result: SearchResult;
  onShowDetails: (result: SearchResult) => void;
  searchType?: 'text' | 'image';
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  onShowDetails,
  searchType = 'text',
}) => {
  const handleClick = () => {
    onShowDetails(result);
  };

  const getScoreClass = (score: number | undefined, threshold: number) => {
    if (!score) return 'low';
    return score >= threshold ? '' : score >= threshold * 0.7 ? 'medium' : 'low';
  };

  const formatScore = (score: number | undefined) => {
    return score ? score.toFixed(3) : 'N/A';
  };

  return (
    <div className={`search-result-card ${searchType === 'image' ? 'image-card' : 'text-card'}`} onClick={handleClick}>
      <div className="search-result-card-header">
        <h3 className="search-result-card-title">
          {searchType === 'image' ? '🖼️ ' : '📄 '}
          {result.title || result.filename || '(No title)'}
        </h3>
        
        <div className="search-result-card-tags">
          <span className="search-result-card-tag-content-type">
            {searchType === 'image' ? result.content_type || 'image' : result.contentType}
          </span>
          {/* Only show locale for text search results */}
          {searchType === 'text' && (
            <span className="search-result-card-tag-locale">
              {result.locale || 'N/A'}
            </span>
          )}
        </div>
      </div>

      {searchType === 'image' && result.url && (
        <div className="search-result-card-image">
          <img 
            src={result.url} 
            alt={result.alt || result.title || 'Image'} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="search-result-card-description">
        <p>
          {result.description || result.alt || 'No description available.'}
        </p>
      </div>

      <div className="search-result-card-scores">
        <div className="search-result-card-score-item">
          <div className="search-result-card-score-label">
            SIMILARITY
          </div>
          <div className={`search-result-card-score-value search-result-card-score-similarity ${getScoreClass(result.similarity, 0.7)}`}>
            {formatScore(result.similarity)}
          </div>
        </div>

        {/* Only show RERANK for text search results */}
        {searchType === 'text' && (
          <div className="search-result-card-score-item">
            <div className="search-result-card-score-label">
              RERANK
            </div>
            <div className={`search-result-card-score-value search-result-card-score-rerank ${getScoreClass(result.rerankScore, 0.5)}`}>
              {formatScore(result.rerankScore)}
            </div>
          </div>
        )}
      </div>

      <div className="search-result-card-footer">
        <div className="search-result-card-uid">
          {result.uid}
        </div>
        <div className="search-result-card-action">
          Click for details →
        </div>
      </div>
    </div>
  );
};
