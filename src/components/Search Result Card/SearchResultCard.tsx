import React from 'react';
import { SearchResult } from '../../types';
import './SearchResultCard.css';

interface SearchResultCardProps {
  result: SearchResult;
  onShowDetails: (result: SearchResult) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  onShowDetails,
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
    <div className="search-result-card" onClick={handleClick}>
      <div className="search-result-card-header">
        <h3 className="search-result-card-title">
          {result.title || '(No title)'}
        </h3>
        
        <div className="search-result-card-tags">
          <span className="search-result-card-tag-content-type">
            {result.contentType}
          </span>
          <span className="search-result-card-tag-locale">
            {result.locale}
          </span>
        </div>
      </div>

      <div className="search-result-card-description">
        <p>
          {result.description || 'No description available.'}
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

        <div className="search-result-card-score-item">
          <div className="search-result-card-score-label">
            RERANK
          </div>
          <div className={`search-result-card-score-value search-result-card-score-rerank ${getScoreClass(result.rerankScore, 0.5)}`}>
            {formatScore(result.rerankScore)}
          </div>
        </div>
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
