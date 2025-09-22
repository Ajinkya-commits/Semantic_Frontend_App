import React from 'react';
import type { SearchResult, ContentType } from '../../types';
import { SearchResultCard } from '../Search Result Card/SearchResultCard';
import './SearchResults.css';

interface SearchResultsProps {
  results: SearchResult[];
  contentTypes: ContentType[];
  onShowDetails: (result: SearchResult) => void;
  searchType?: 'text' | 'image';
}

const MIN_SIMILARITY_SCORE = 0.2;
const MIN_RERANK_SCORE = 0.003;

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  contentTypes,
  onShowDetails,
  searchType = 'text',
}) => {
  const filteredResults = results
    .filter((r) => {
      const similarityPass = (r.similarity ?? 0) >= MIN_SIMILARITY_SCORE;
      const rerankPass = (r.rerankScore ?? 0) >= MIN_RERANK_SCORE;
      return similarityPass || rerankPass;
    })
    .slice(0, searchType === 'image' ? 12 : 5); 

  if (filteredResults.length === 0) {
    return (
      <div className="search-results-empty">
        <div className="search-results-empty-icon">
          {searchType === 'image' ? '🖼️' : '🔍'}
        </div>
        <h3 className="search-results-empty-title">No results found</h3>
        <p className="search-results-empty-text">
          {searchType === 'image' 
            ? 'Try a different image or description' 
            : 'Try adjusting your search terms or filters'
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="search-results-header">
        <div className="search-results-header-info">
          <h3>
            {searchType === 'image' ? '🖼️ Image Search Results' : '� Search Results'}
          </h3>
          <p>
            Found {filteredResults.length} {searchType === 'image' ? 'similar images' : 'relevant entries'}
          </p>
        </div>
        <div className="search-results-header-actions">
          <span className="search-results-content-types-badge">
            {contentTypes.length} content types
          </span>
        </div>
      </div>

      <div className={`search-results-grid ${searchType === 'image' ? 'image-grid' : 'text-grid'}`}>
        {filteredResults
          .sort((a, b) => (b.rerankScore ?? b.similarity ?? 0) - (a.rerankScore ?? a.similarity ?? 0))
          .map((result, index) => (
            <SearchResultCard
              key={result.uid || `result-${index}`}
              result={result}
              onShowDetails={onShowDetails}
              searchType={searchType}
            />
          ))}
      </div>
    </>
  );
};
