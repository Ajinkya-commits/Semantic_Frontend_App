import React, { useState } from 'react';
import { useTextSearch } from '../hooks/useTextSearch';
import type { ContentType } from '../../../core/types/config';
import type { SearchResult } from '../../../core/types/search';

interface TextSearchBoxProps {
  contentTypes: ContentType[];
  onResults?: (results: SearchResult[]) => void;
}

export const TextSearchBox: React.FC<TextSearchBoxProps> = ({
  contentTypes,
  onResults,
}) => {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'text' | 'semantic'>('semantic');
  const [limit, setLimit] = useState(10);

  const { results, loading, error, searchText, clearResults } = useTextSearch();

  React.useEffect(() => {
    if (onResults) {
      onResults(results);
    }
  }, [results, onResults]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const params = {
      query: query.trim(),
      limit,
      searchType,
      contentTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
    };

    await searchText(params);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedTypes([]);
    clearResults();
  };

  const handleContentTypeToggle = (contentTypeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(contentTypeId)
        ? prev.filter(id => id !== contentTypeId)
        : [...prev, contentTypeId]
    );
  };

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e9ecef',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '20px' }}>
          🔍 Text Search
        </h3>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
          Search your content using natural language queries with AI-powered semantic understanding
        </p>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Search Query
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#ced4da'}
        />
      </div>

      {/* Search Type Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Search Type
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSearchType('semantic')}
            style={{
              padding: '8px 16px',
              backgroundColor: searchType === 'semantic' ? '#007bff' : '#f8f9fa',
              color: searchType === 'semantic' ? 'white' : '#6c757d',
              border: '1px solid',
              borderColor: searchType === 'semantic' ? '#007bff' : '#e9ecef',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}>
            🧠 Semantic Search
          </button>
          <button
            onClick={() => setSearchType('text')}
            style={{
              padding: '8px 16px',
              backgroundColor: searchType === 'text' ? '#007bff' : '#f8f9fa',
              color: searchType === 'text' ? 'white' : '#6c757d',
              border: '1px solid',
              borderColor: searchType === 'text' ? '#007bff' : '#e9ecef',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}>
            📝 Text Search
          </button>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
          {searchType === 'semantic' 
            ? 'AI-powered search that understands context and meaning'
            : 'Traditional keyword-based text search'
          }
        </p>
      </div>

      {/* Content Type Filters */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Content Types ({selectedTypes.length} selected)
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
          maxHeight: '120px',
          overflowY: 'auto'
        }}>
          {contentTypes.map((contentType) => (
            <label
              key={contentType.uid}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#495057'
              }}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(contentType.uid)}
                onChange={() => handleContentTypeToggle(contentType.uid)}
                style={{ marginRight: '8px' }}
              />
              {contentType.title}
            </label>
          ))}
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
          Leave empty to search all content types
        </p>
      </div>

      {/* Limit Setting */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Results Limit
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '6px',
            fontSize: '14px',
            width: '100px'
          }}
        />
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
          Maximum number of results to return (1-50)
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '6px',
          border: '1px solid #f5c6cb',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: loading || !query.trim() ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Searching...
            </>
          ) : (
            <>
              🔍 Search
            </>
          )}
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}>
          🗑️ Clear
        </button>
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
