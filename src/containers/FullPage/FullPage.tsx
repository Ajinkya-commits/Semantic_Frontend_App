import React, { useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useReindex } from '../../hooks/useReindex';
import { useContentTypes } from '../../hooks/useContentTypes';
import { SearchBox } from '../../components/SearchBox/SearchBox';
import { SearchResults } from '../../components/Search Result/SearchResults';
import { ReindexSection } from '../../components/Reindex Page/ReindexSection';
import { EntryDetailsModal } from '../../components/Entry Modal/EntryDetailsModal';
import { AnalyticsDashboard } from '../../components';
import type { SearchResult } from '../../types';

type ActiveTab = 'search' | 'indexing' | 'analytics';

const FullPage: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    loading: isSearching,
    selectedType: selectedContentTypes,
    setSelectedType: setSelectedContentTypes,
    handleSearch,
    clearSearch,
  } = useSearch();

  const {
    reindexing: isReindexing,
    progress: reindexProgress,
    reindexResults,
    handleReindex: startReindex,
    clearReindexResults,
  } = useReindex();

  const { contentTypes, loading: contentTypesLoading } = useContentTypes();

  const handleShowDetails = (result: SearchResult) => {
    setSelectedEntry(result);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '28px' }}>
          🔍 Semantic Search
        </h1>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
          Search your Contentstack entries using natural language powered by AI embeddings
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '1px solid #e9ecef',
        paddingBottom: '16px'
      }}>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'search' ? '#007bff' : 'transparent',
            color: activeTab === 'search' ? 'white' : '#6c757d',
            border: '1px solid',
            borderColor: activeTab === 'search' ? '#007bff' : '#e9ecef',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}>
          🔍 Search
        </button>

        <button
          onClick={() => setActiveTab('indexing')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'indexing' ? '#007bff' : 'transparent',
            color: activeTab === 'indexing' ? 'white' : '#6c757d',
            border: '1px solid',
            borderColor: activeTab === 'indexing' ? '#007bff' : '#e9ecef',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}>
          ⚙️ Indexing
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'analytics' ? '#007bff' : 'transparent',
            color: activeTab === 'analytics' ? 'white' : '#6c757d',
            border: '1px solid',
            borderColor: activeTab === 'analytics' ? '#007bff' : '#e9ecef',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}>
          📊 Analytics
        </button>
      </div>

      {activeTab === 'search' && (
        <>
          <SearchBox
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedContentTypes={selectedContentTypes}
            onContentTypesChange={setSelectedContentTypes}
            contentTypes={contentTypes}
            isLoadingContentTypes={contentTypesLoading}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
            isSearching={isSearching}
            hasResults={searchResults.length > 0}
          />

          {searchResults.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <SearchResults
                results={searchResults}
                loading={isSearching}
                contentTypes={contentTypes}
                onShowDetails={handleShowDetails}
                onClearSearch={clearSearch}
              />
            </div>
          )}
        </>
      )}

      {activeTab === 'indexing' && (
        <div style={{ marginTop: '24px' }}>
          <ReindexSection
            isReindexing={isReindexing}
            reindexProgress={reindexProgress}
            reindexResults={reindexResults}
            onStartReindex={startReindex}
            onClearResults={clearReindexResults}
          />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ marginTop: '24px' }}>
          <AnalyticsDashboard />
        </div>
      )}

      {selectedEntry && (
        <EntryDetailsModal
          selectedEntry={selectedEntry}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          contentTypes={contentTypes}
        />
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default FullPage;
