import React, { useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useReindex } from '../../hooks/useReindex';
import { useContentTypes } from '../../hooks/useContentTypes';
import { SearchBox } from '../../components/SearchBox/SearchBox';
import { SearchResults } from '../../shared/components/SearchResults/SearchResults';
import { ReindexSection } from '../../components/ReindexSection/ReindexSection';
import { EntryDetailsModal } from '../../shared/components/EntryDetailsModal/EntryDetailsModal';
import type { SearchResult } from '../../hooks/useSearch';

const FullPage: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const { contentTypes } = useContentTypes();

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

      <SearchBox
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedContentTypes={selectedContentTypes}
        onContentTypesChange={setSelectedContentTypes}
        contentTypes={contentTypes}
        isLoadingContentTypes={false}
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

      <div style={{ marginTop: '48px' }}>
        <ReindexSection
          isReindexing={isReindexing}
          reindexProgress={reindexProgress}
          reindexResults={reindexResults}
          onStartReindex={startReindex}
          onClearResults={clearReindexResults}
        />
      </div>

      <EntryDetailsModal
        selectedEntry={selectedEntry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

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
