import { useState, useCallback, useEffect } from 'react';
import { searchApi, imageSearchApi } from '../services/api';
import type { SearchResult, SearchParams } from '../types';

type SearchType = 'text' | 'image';

export const useUnifiedSearch = () => {
  const [query, setQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<SearchType>('text');

  // Clear results when switching between search types
  useEffect(() => {
    setResults([]);
    setError(null);
  }, [searchType]);

  const handleTextSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const searchParams: SearchParams = {
        query: query.trim(),
        limit: 20,
        useReranking: true,
        contentTypes: selectedType.length > 0 ? selectedType : undefined,
      };

      const response = await searchApi.searchSemantic(searchParams);
      
      if (response.success) {
        setResults(response.results);
      } else {
        throw new Error('Text search failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Text search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, selectedType]);

  const handleImageSearch = useCallback(async () => {
    if (!imageUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await imageSearchApi.searchByImageUrl(imageUrl.trim(), 5);
      
      if (response.success) {
        setResults(response.results);
      } else {
        throw new Error('Image search failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [imageUrl]);

  const handleImageUploadSearch = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const response = await imageSearchApi.searchByUpload(file, 5);
      
      if (response.success) {
        setResults(response.results);
      } else {
        throw new Error('Image upload search failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image upload search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchType === 'text') {
      handleTextSearch();
    } else if (searchType === 'image') {
      if (imageUrl.trim()) {
        handleImageSearch();
      }
    }
  }, [searchType, handleTextSearch, handleImageSearch, imageUrl]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setImageUrl('');
    setResults([]);
    setError(null);
    setSelectedType([]);
  }, []);

  return {
    // Search state
    query,
    setQuery,
    imageUrl,
    setImageUrl,
    results,
    loading,
    error,
    selectedType,
    setSelectedType,
    searchType,
    setSearchType,
    
    // Search actions
    handleSearch,
    handleImageUploadSearch,
    clearSearch,
  };
};
