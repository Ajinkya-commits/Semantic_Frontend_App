import React from 'react';
import { SearchResult } from '../../../core/types/search';
import { ContentType } from '../../../core/types/config';
import { SearchResultCard } from '../SearchResultCard/SearchResultCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

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
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6c757d',
        }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>No results found</h3>
        <p style={{ margin: '0 0 20px 0' }}>Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: '#495057', fontSize: '18px' }}>
            📊 Search Results
          </h3>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
            Showing {filteredResults.length} of {results.length} matches
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
          <span
            style={{
              fontSize: '12px',
              color: '#6c757d',
              backgroundColor: '#e9ecef',
              padding: '4px 8px',
              borderRadius: '12px',
            }}>
            {contentTypes.length} content types
          </span>
          <button
            onClick={onClearSearch}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}>
            Clear
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        }}>
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
