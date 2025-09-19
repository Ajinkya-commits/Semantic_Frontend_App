import { useState, useCallback } from 'react';
import { searchApi } from '../services/api';
import type { SearchResult, SearchParams } from '../types';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const handleSearch = useCallback(async () => {
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
        throw new Error('Search failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, selectedType]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setSelectedType([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    selectedType,
    setSelectedType,
    handleSearch,
    clearSearch,
  };
};
