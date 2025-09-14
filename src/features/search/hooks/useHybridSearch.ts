import { useState } from 'react';
import { searchApi } from '../../../core/services/api/searchApi';
import type { SearchResult, HybridSearchParams, SearchResponse } from '../../../core/types/search';

export const useHybridSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchHybrid = async (params: HybridSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await searchApi.searchHybrid(params);
      setResults(response.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Hybrid search failed';
      setError(errorMessage);
      console.error('Hybrid search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    searchHybrid,
    clearResults
  };
};
