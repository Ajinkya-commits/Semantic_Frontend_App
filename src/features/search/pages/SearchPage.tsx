import React, { useState } from 'react';
import { TextSearchBox } from '../components/TextSearchBox';
import { ImageSearchBox } from '../components/ImageSearchBox';
import { HybridSearchBox } from '../components/HybridSearchBox';
import { SearchResults } from '../../../shared/components/SearchResults/SearchResults';
import { EntryDetailsModal } from '../../../shared/components/EntryDetailsModal/EntryDetailsModal';
import { configApi } from '../../../core/services/api/configApi';
import type { SearchResult } from '../../../core/types/search';
import type { ContentType } from '../../../core/types/config';

export const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'hybrid'>('text');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load content types on mount
  React.useEffect(() => {
    const loadContentTypes = async () => {
      try {
        const types = await configApi.getContentTypes();
        setContentTypes(types);
      } catch (error) {
        console.error('Failed to load content types:', error);
      }
    };

    loadContentTypes();
  }, []);

  const handleShowDetails = (result: SearchResult) => {
    setSelectedEntry(result);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  const handleClearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '28px' }}>
          🔍 Advanced Semantic Search
        </h1>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
          Search your Contentstack entries using text, images, or hybrid AI-powered search
        </p>
      </div>

      {/* Search Type Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e0e0e0',
          gap: '0'
        }}>
          {[
            { key: 'text', label: '🔍 Text Search', desc: 'Natural language queries' },
            { key: 'image', label: '🖼️ Image Search', desc: 'Visual similarity search' },
            { key: 'hybrid', label: '🔍🖼️ Hybrid Search', desc: 'Combined text + image' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '16px 24px',
                border: 'none',
                backgroundColor: activeTab === tab.key ? '#007bff' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#666',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                fontSize: '16px',
                fontWeight: activeTab === tab.key ? '600' : '400',
                transition: 'all 0.2s ease',
                marginRight: '4px',
              }}
            >
              <div>{tab.label}</div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8, 
                marginTop: '4px' 
              }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Components */}
      <div style={{ marginBottom: '32px' }}>
        {activeTab === 'text' && (
          <TextSearchBox
            contentTypes={contentTypes}
            onResults={setResults}
          />
        )}
        
        {activeTab === 'image' && (
          <ImageSearchBox
            onResults={setResults}
          />
        )}
        
        {activeTab === 'hybrid' && (
          <HybridSearchBox
            contentTypes={contentTypes}
            onResults={setResults}
          />
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>
              Search Results ({results.length})
            </h2>
            <button
              onClick={handleClearResults}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Clear Results
            </button>
          </div>
          
          <SearchResults
            results={results}
            loading={false}
            contentTypes={contentTypes}
            onShowDetails={handleShowDetails}
            onClearSearch={handleClearResults}
          />
        </div>
      )}

      {/* Entry Details Modal */}
      <EntryDetailsModal
        selectedEntry={selectedEntry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Search Tips */}
      <div style={{ 
        marginTop: '48px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>💡 Search Tips</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>Text Search</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
              <li>Use natural language queries</li>
              <li>Try semantic search for better results</li>
              <li>Filter by content types</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>Image Search</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
              <li>Search by image URL or upload</li>
              <li>Finds visually similar content</li>
              <li>Works with photos, graphics, logos</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>Hybrid Search</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
              <li>Combine text and image queries</li>
              <li>Adjust weights for precision</li>
              <li>Best for complex searches</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
