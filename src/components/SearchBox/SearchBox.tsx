import React, { useState, useRef } from 'react';
import type { ContentType } from '../../types';
import './SearchBox.css'

type SearchType = 'text' | 'image';

interface SearchBoxProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  selectedContentTypes: string[];
  onContentTypesChange: (types: string[]) => void;
  contentTypes: ContentType[];
  isLoadingContentTypes: boolean;
  onSearch: () => void;
  onClearSearch: () => void;
  isSearching: boolean;
  hasResults: boolean;
  searchType: SearchType;
  onSearchTypeChange: (type: SearchType) => void;
  onImageSearch: (file: File) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery,
  onSearchQueryChange,
  imageUrl,
  onImageUrlChange,
  selectedContentTypes,
  onContentTypesChange,
  contentTypes,
  onSearch,
  onClearSearch,
  isSearching,
  hasResults,
  searchType,
  onSearchTypeChange,
  onImageSearch,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSearch(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onImageSearch(file);
      }
    }
  };

  const handleClear = () => {
    onClearSearch();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="search-box">
      {/* Search Type Toggle */}
      <div className="search-type-toggle">
        <button 
          className={`toggle-btn ${searchType === 'text' ? 'active' : ''}`}
          onClick={() => onSearchTypeChange('text')}
        >
          📝 Text Search
        </button>
        <button 
          className={`toggle-btn ${searchType === 'image' ? 'active' : ''}`}
          onClick={() => onSearchTypeChange('image')}
        >
          🖼️ Image Search
        </button>
      </div>

      {/* Text Search Interface */}
      {searchType === 'text' && (
        <div className="search-controls">
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
        </div>
      )}

      {/* Image Search Interface */}
      {searchType === 'image' && (
        <div className="image-search-container">
          {/* Image URL Input */}
          <input
            type="url"
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          {/* Drag & Drop Area */}
          <div 
            className={`image-drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-zone-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#666">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              <p>Drag & drop an image here or click to browse</p>
              <p className="drop-zone-hint">Supports: JPG, PNG, GIF, WebP</p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-row">
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
          <span>{isSearching ? 'Searching...' : searchType === 'text' ? 'Search Text' : 'Search Images'}</span>
        </button>

        {/* Clear Button */}
        {(searchQuery || imageUrl || hasResults) && (
          <button
            className="search-btn"
            onClick={handleClear}
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
    </div>
  );
};
