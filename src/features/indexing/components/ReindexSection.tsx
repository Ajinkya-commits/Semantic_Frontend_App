import React, { useState } from 'react';
import { useIndexing } from '../hooks/useIndexing';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner/LoadingSpinner';
import type { ContentType } from '../../../core/types/config';

interface ReindexSectionProps {
  contentTypes: ContentType[];
}

export const ReindexSection: React.FC<ReindexSectionProps> = ({ contentTypes }) => {
  const {
    reindexStatus,
    isReindexing,
    reindexProgress,
    startReindex,
    clearIndex,
    getIndexStatus,
    error
  } = useIndexing();

  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState(50);

  const handleReindex = async () => {
    await startReindex({
      contentTypes: selectedContentTypes.length > 0 ? selectedContentTypes : undefined,
      batchSize,
      clearExisting: true
    });
  };

  const handleClearIndex = async () => {
    if (window.confirm('Are you sure you want to clear the entire search index? This action cannot be undone.')) {
      await clearIndex();
    }
  };

  const handleContentTypeToggle = (contentTypeId: string) => {
    setSelectedContentTypes(prev => 
      prev.includes(contentTypeId)
        ? prev.filter(id => id !== contentTypeId)
        : [...prev, contentTypeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContentTypes(contentTypes.map(ct => ct.uid));
  };

  const handleSelectNone = () => {
    setSelectedContentTypes([]);
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
        <h2 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '24px' }}>
          🔄 Index Management
        </h2>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
          Manage your search index by reindexing content or clearing existing data
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

      {/* Status Display */}
      {reindexStatus && (
        <div style={{
          padding: '16px',
          backgroundColor: '#d1ecf1',
          borderRadius: '8px',
          border: '1px solid #bee5eb',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#0c5460' }}>Index Status</h4>
              <p style={{ margin: 0, color: '#0c5460', fontSize: '14px' }}>
                Status: <strong>{reindexStatus.status}</strong>
              </p>
              {reindexStatus.totalEntries && (
                <p style={{ margin: '4px 0 0 0', color: '#0c5460', fontSize: '14px' }}>
                  Total Entries: <strong>{reindexStatus.totalEntries}</strong>
                </p>
              )}
            </div>
            <button
              onClick={getIndexStatus}
              style={{
                padding: '6px 12px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}>
              Refresh Status
            </button>
          </div>
        </div>
      )}

      {/* Progress Display */}
      {isReindexing && reindexProgress && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffeaa7',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#856404' }}>Reindexing in Progress</h4>
          
          <div style={{
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            height: '8px',
            marginBottom: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#28a745',
              height: '100%',
              width: `${(reindexProgress.processed / reindexProgress.total) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#856404' }}>
            <span>Progress: {reindexProgress.processed} / {reindexProgress.total}</span>
            <span>{Math.round((reindexProgress.processed / reindexProgress.total) * 100)}%</span>
          </div>
          
          {reindexProgress.currentContentType && (
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#856404' }}>
              Processing: <strong>{reindexProgress.currentContentType}</strong>
            </p>
          )}
        </div>
      )}

      {/* Content Type Selection */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#495057', fontSize: '18px' }}>
          Content Types to Reindex
        </h3>
        
        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={handleSelectAll}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              marginRight: '8px'
            }}>
            Select All
          </button>
          <button
            onClick={handleSelectNone}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
            Select None
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef'
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
                checked={selectedContentTypes.includes(contentType.uid)}
                onChange={() => handleContentTypeToggle(contentType.uid)}
                style={{ marginRight: '8px' }}
              />
              {contentType.title}
            </label>
          ))}
        </div>
        
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
          Leave empty to reindex all content types
        </p>
      </div>

      {/* Batch Size Configuration */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Batch Size
        </label>
        <input
          type="number"
          min="10"
          max="200"
          value={batchSize}
          onChange={(e) => setBatchSize(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '6px',
            fontSize: '14px',
            width: '120px'
          }}
        />
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
          Number of entries to process in each batch (10-200)
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={handleReindex}
          disabled={isReindexing}
          style={{
            padding: '12px 24px',
            backgroundColor: isReindexing ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isReindexing ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
          {isReindexing ? (
            <>
              <LoadingSpinner size="small" message="" />
              Reindexing...
            </>
          ) : (
            <>
              🔄 Start Reindex
            </>
          )}
        </button>

        <button
          onClick={handleClearIndex}
          disabled={isReindexing}
          style={{
            padding: '12px 24px',
            backgroundColor: isReindexing ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isReindexing ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}>
          🗑️ Clear Index
        </button>

        <button
          onClick={getIndexStatus}
          style={{
            padding: '12px 24px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}>
          📊 Check Status
        </button>
      </div>

      {/* Help Text */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>💡 Indexing Tips</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#6c757d', fontSize: '14px' }}>
          <li>Reindexing will update the search index with the latest content from Contentstack</li>
          <li>Select specific content types to reindex only those, or leave empty for all</li>
          <li>Larger batch sizes are faster but use more memory</li>
          <li>Clearing the index will remove all existing search data</li>
          <li>The process may take several minutes depending on your content volume</li>
        </ul>
      </div>
    </div>
  );
};
