import React, { useEffect, useState } from 'react';
import { ReindexSection } from '../components/ReindexSection';
import { configApi } from '../../../core/services/api/configApi';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner/LoadingSpinner';
import type { ContentType } from '../../../core/types/config';

export const IndexingPage: React.FC = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContentTypes = async () => {
      try {
        setLoading(true);
        const types = await configApi.getContentTypes();
        setContentTypes(types);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content types');
        console.error('Failed to load content types:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContentTypes();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <LoadingSpinner message="Loading content types..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          border: '1px solid #f5c6cb',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px 0' }}>❌ Error Loading Content Types</h2>
          <p style={{ margin: 0 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '28px' }}>
          🔄 Index Management
        </h1>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
          Manage your Contentstack search index - reindex content, monitor progress, and maintain optimal search performance
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '4px' }}>
            {contentTypes.length}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Content Types</div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', marginBottom: '4px' }}>
            Ready
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Index Status</div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8', marginBottom: '4px' }}>
            AI-Powered
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Search Type</div>
        </div>
      </div>

      {/* Main Reindex Section */}
      <ReindexSection contentTypes={contentTypes} />

      {/* Information Section */}
      <div style={{
        marginTop: '32px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#495057', fontSize: '20px' }}>
          📚 About Search Indexing
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 12px 0', color: '#007bff', fontSize: '16px' }}>
              🔍 What is Indexing?
            </h3>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', lineHeight: '1.5' }}>
              Indexing processes your Contentstack entries and creates searchable embeddings using AI. 
              This enables semantic search capabilities that understand context and meaning, not just keywords.
            </p>
          </div>

          <div>
            <h3 style={{ margin: '0 0 12px 0', color: '#28a745', fontSize: '16px' }}>
              🚀 When to Reindex
            </h3>
            <ul style={{ margin: 0, paddingLeft: '16px', color: '#6c757d', fontSize: '14px', lineHeight: '1.5' }}>
              <li>After adding new content to Contentstack</li>
              <li>When content has been significantly updated</li>
              <li>After changing content type structures</li>
              <li>If search results seem outdated</li>
            </ul>
          </div>

          <div>
            <h3 style={{ margin: '0 0 12px 0', color: '#ffc107', fontSize: '16px' }}>
              ⚡ Performance Tips
            </h3>
            <ul style={{ margin: 0, paddingLeft: '16px', color: '#6c757d', fontSize: '14px', lineHeight: '1.5' }}>
              <li>Use smaller batch sizes for large content volumes</li>
              <li>Reindex during off-peak hours</li>
              <li>Monitor progress and system resources</li>
              <li>Consider selective reindexing by content type</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content Types Overview */}
      <div style={{
        marginTop: '32px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#495057', fontSize: '20px' }}>
          📋 Available Content Types
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '12px'
        }}>
          {contentTypes.map((contentType) => (
            <div
              key={contentType.uid}
              style={{
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <div>
                <div style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                  {contentType.title}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'monospace' }}>
                  {contentType.uid}
                </div>
              </div>
              <div style={{
                padding: '2px 6px',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '500'
              }}>
                {contentType.schema?.length || 0} fields
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
