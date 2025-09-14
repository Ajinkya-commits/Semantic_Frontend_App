import React, { useState, useRef } from 'react';
import { useHybridSearch } from '../hooks/useHybridSearch';
import type { ContentType } from '../../../core/types/config';
import type { SearchResult } from '../../../core/types/search';

interface HybridSearchBoxProps {
  contentTypes: ContentType[];
  onResults?: (results: SearchResult[]) => void;
}

export const HybridSearchBox: React.FC<HybridSearchBoxProps> = ({
  contentTypes,
  onResults,
}) => {
  const [textQuery, setTextQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [limit, setLimit] = useState(10);
  const [weights, setWeights] = useState({ text: 0.7, image: 0.3 });

  const { results, loading, error, searchHybrid, clearResults } = useHybridSearch();

  React.useEffect(() => {
    if (onResults) {
      onResults(results);
    }
  }, [results, onResults]);

  const handleSearch = async () => {
    if (!textQuery.trim() && !imageUrl.trim() && !selectedFile) return;

    const params = {
      textQuery: textQuery.trim() || undefined,
      imageUrl: imageMode === 'url' ? imageUrl.trim() || undefined : undefined,
      imageFile: imageMode === 'upload' ? selectedFile || undefined : undefined,
      contentTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
      limit,
      weights,
    };

    await searchHybrid(params);
  };

  const handleClear = () => {
    setTextQuery('');
    setImageUrl('');
    setSelectedFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const hasValidInput = textQuery.trim() || 
    (imageMode === 'url' && imageUrl.trim()) || 
    (imageMode === 'upload' && selectedFile);

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
          🔀 Hybrid Search
        </h3>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
          Combine text and image search for more precise results using AI-powered multimodal search
        </p>
      </div>

      {/* Text Query Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Text Query (Optional)
        </label>
        <input
          type="text"
          value={textQuery}
          onChange={(e) => setTextQuery(e.target.value)}
          placeholder="Enter your search query..."
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

      {/* Image Search Section */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Image Search (Optional)
        </label>
        
        {/* Image Mode Toggle */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setImageMode('url')}
              style={{
                padding: '6px 12px',
                backgroundColor: imageMode === 'url' ? '#007bff' : '#f8f9fa',
                color: imageMode === 'url' ? 'white' : '#6c757d',
                border: '1px solid',
                borderColor: imageMode === 'url' ? '#007bff' : '#e9ecef',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}>
              🔗 URL
            </button>
            <button
              onClick={() => setImageMode('upload')}
              style={{
                padding: '6px 12px',
                backgroundColor: imageMode === 'upload' ? '#007bff' : '#f8f9fa',
                color: imageMode === 'upload' ? 'white' : '#6c757d',
                border: '1px solid',
                borderColor: imageMode === 'upload' ? '#007bff' : '#e9ecef',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}>
              📁 Upload
            </button>
          </div>
        </div>

        {/* URL Input */}
        {imageMode === 'url' && (
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ced4da'}
          />
        )}

        {/* File Upload */}
        {imageMode === 'upload' && (
          <div style={{
            border: '2px dashed #ced4da',
            borderRadius: '6px',
            padding: '16px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            transition: 'border-color 0.2s ease'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="hybrid-image-upload"
            />
            <label
              htmlFor="hybrid-image-upload"
              style={{
                cursor: 'pointer',
                display: 'block'
              }}>
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>✅</div>
                  <div style={{ color: '#495057', fontWeight: '500', fontSize: '14px' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '12px', marginTop: '2px' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>📁</div>
                  <div style={{ color: '#495057', fontWeight: '500', fontSize: '14px' }}>
                    Click to select image
                  </div>
                </div>
              )}
            </label>
          </div>
        )}
      </div>

      {/* Search Weights */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Search Weights
        </label>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px', display: 'block' }}>
              Text: {(weights.text * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={weights.text}
              onChange={(e) => {
                const textWeight = parseFloat(e.target.value);
                setWeights({ text: textWeight, image: 1 - textWeight });
              }}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px', display: 'block' }}>
              Image: {(weights.image * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={weights.image}
              onChange={(e) => {
                const imageWeight = parseFloat(e.target.value);
                setWeights({ text: 1 - imageWeight, image: imageWeight });
              }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
          Adjust the balance between text and image similarity
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '6px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
          maxHeight: '100px',
          overflowY: 'auto'
        }}>
          {contentTypes.map((contentType) => (
            <label
              key={contentType.uid}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#495057'
              }}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(contentType.uid)}
                onChange={() => handleContentTypeToggle(contentType.uid)}
                style={{ marginRight: '6px' }}
              />
              {contentType.title}
            </label>
          ))}
        </div>
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
          disabled={loading || !hasValidInput}
          style={{
            padding: '12px 24px',
            backgroundColor: loading || !hasValidInput ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || !hasValidInput ? 'not-allowed' : 'pointer',
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
              🔀 Hybrid Search
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
