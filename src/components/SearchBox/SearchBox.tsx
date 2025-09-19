import React from 'react';
import type { ContentType } from '../../types';
import './SearchBox.css'

interface SearchBoxProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedContentTypes: string[];
  onContentTypesChange: (types: string[]) => void;
  contentTypes: ContentType[];
  isLoadingContentTypes: boolean;
  onSearch: () => void;
  onClearSearch: () => void;
  isSearching: boolean;
  hasResults: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedContentTypes,
  onContentTypesChange,
  contentTypes,
  onSearch,
  onClearSearch,
  isSearching,
  hasResults,
}) => {
  const handleSearchClick = () => {
    onSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleContentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      onContentTypesChange([]);
    } else {
      onContentTypesChange([value]);
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search content..."
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <select 
        value={selectedContentTypes[0] || ""} 
        onChange={handleContentTypeChange}
      >
        <option value="">All Types</option>
        {contentTypes.map((type) => (
          <option key={type.uid} value={type.uid}>
            {type.title}
          </option>
        ))}
      </select>

      <button className="search-btn" onClick={handleSearchClick} disabled={isSearching}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          viewBox="0 0 24 24"
          style={{ marginRight: '8px' }}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm-6 8a6 6 0 1112 0 6 6 0 01-12 0z"
            fill="white"
          />
        </svg>
        <span>{isSearching ? 'Searching...' : 'Search'}</span>
      </button>

      {(searchQuery || hasResults) && (
        <button
          className="search-btn"
          onClick={onClearSearch}
          style={{ backgroundColor: '#dc3545', marginLeft: '8px' }}
          title="Clear search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            viewBox="0 0 24 24"
            style={{ marginRight: '8px' }}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
              fill="white"
            />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
};
