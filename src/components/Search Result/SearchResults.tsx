import React from 'react';
import type { SearchResult, ContentType } from '../../types';
import { SearchResultCard } from '../Search Result Card/SearchResultCard';
import { LoadingSpinner } from '../Loading Spinner/LoadingSpinner';
import './SearchResults.css';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  contentTypes: ContentType[];
  onShowDetails: (result: SearchResult) => void;
  onClearSearch: () => void;
}

const MIN_SIMILARITY_SCORE = 0.2;
const MIN_RERANK_SCORE = 0.003;

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  contentTypes,
  onShowDetails,
  onClearSearch,
}) => {
  const filteredResults = results
    .filter((r) => {
      const similarityPass = (r.similarity ?? 0) >= MIN_SIMILARITY_SCORE;
      const rerankPass = (r.rerankScore ?? 0) >= MIN_RERANK_SCORE;
      return similarityPass || rerankPass;
    })
    .slice(0, 5);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (filteredResults.length === 0) {
    return (
      <div className="search-results-empty">
        <div className="search-results-empty-icon">🔍</div>
        <h3 className="search-results-empty-title">No results found</h3>
        <p className="search-results-empty-text">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="search-results-header">
        <div className="search-results-header-info">
          <h3>📊 Search Results</h3>
          <p>Showing {filteredResults.length} of {results.length} matches</p>
        </div>
        <div className="search-results-header-actions">
          <span className="search-results-content-types-badge">
            {contentTypes.length} content types
          </span>
          <button onClick={onClearSearch} className="search-results-clear-button">
            Clear
          </button>
        </div>
      </div>

      <div className="search-results-grid">
        {filteredResults
          .sort((a, b) => (b.rerankScore ?? 0) - (a.rerankScore ?? 0))
          .map((result, index) => (
            <SearchResultCard
              key={`${result.uid}-${index}`}
              result={result}
              onShowDetails={onShowDetails}
            />
          ))}
      </div>
    </>
  );
};
