import React, { useState } from 'react';
import { useImageSearch } from '../hooks/useImageSearch';
import type { SearchResult } from '../../../core/types/search';

interface ImageSearchBoxProps {
  onResults?: (results: SearchResult[]) => void;
}

export const ImageSearchBox: React.FC<ImageSearchBoxProps> = ({
  onResults,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchMode, setSearchMode] = useState<'url' | 'upload'>('url');
  const [limit, setLimit] = useState(10);

  const { results, loading, error, searchByImage, clearResults } = useImageSearch();

  React.useEffect(() => {
    if (onResults) {
      onResults(results);
    }
  }, [results, onResults]);

  const handleSearch = async () => {
    if (searchMode === 'url') {
      if (!imageUrl.trim()) return;
      
      const params = {
        imageUrl: imageUrl.trim(),
        limit,
      };
      
      await searchByImage(params);
    } else {
      if (!selectedFile) return;
      
      const params = {
        imageFile: selectedFile,
        limit,
      };
      
      await searchByImage(params);
    }
  };

  const handleClear = () => {
    setImageUrl('');
    setSelectedFile(null);
    clearResults();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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
          🖼️ Image Search
        </h3>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
          Find visually similar content using image similarity search powered by AI
        </p>
      </div>

      {/* Search Mode Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Search Method
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSearchMode('url')}
            style={{
              padding: '8px 16px',
              backgroundColor: searchMode === 'url' ? '#007bff' : '#f8f9fa',
              color: searchMode === 'url' ? 'white' : '#6c757d',
              border: '1px solid',
              borderColor: searchMode === 'url' ? '#007bff' : '#e9ecef',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}>
            🔗 Image URL
          </button>
          <button
            onClick={() => setSearchMode('upload')}
            style={{
              padding: '8px 16px',
              backgroundColor: searchMode === 'upload' ? '#007bff' : '#f8f9fa',
              color: searchMode === 'upload' ? 'white' : '#6c757d',
              border: '1px solid',
              borderColor: searchMode === 'upload' ? '#007bff' : '#e9ecef',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}>
            📁 Upload Image
          </button>
        </div>
      </div>

      {/* URL Input */}
      {searchMode === 'url' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#495057'
          }}>
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL (jpg, png, gif, webp)..."
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
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
            Supported formats: JPEG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {/* File Upload */}
      {searchMode === 'upload' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#495057'
          }}>
            Upload Image
          </label>
          <div style={{
            border: '2px dashed #ced4da',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            transition: 'border-color 0.2s ease'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              style={{
                cursor: 'pointer',
                display: 'block'
              }}>
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                  <div style={{ color: '#495057', fontWeight: '500' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                  <div style={{ color: '#495057', fontWeight: '500' }}>
                    Click to select an image
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                    Supported: JPEG, PNG, GIF, WebP (max 10MB)
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
      )}

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
          disabled={loading || (searchMode === 'url' && !imageUrl.trim()) || (searchMode === 'upload' && !selectedFile)}
          style={{
            padding: '12px 24px',
            backgroundColor: loading || (searchMode === 'url' && !imageUrl.trim()) || (searchMode === 'upload' && !selectedFile) ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || (searchMode === 'url' && !imageUrl.trim()) || (searchMode === 'upload' && !selectedFile) ? 'not-allowed' : 'pointer',
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
              🖼️ Search Similar
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
