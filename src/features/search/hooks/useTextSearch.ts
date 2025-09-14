import { useState } from 'react';
import { searchApi } from '../../../core/services/api/searchApi';
import type { SearchResult, TextSearchParams, SearchResponse } from '../../../core/types/search';

export interface UseTextSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  searchText: (params: TextSearchParams) => Promise<void>;
  clearResults: () => void;
}

export const useTextSearch = (): UseTextSearchReturn => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchText = async (params: TextSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      let response: SearchResponse;
      
      // Use semantic search by default, fallback to text search if specified
      if (params.searchType === 'text') {
        response = await searchApi.searchText(params);
      } else {
        response = await searchApi.searchSemantic(params);
      }
      
      setResults(response.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Text search error:', err);
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
    searchText,
    clearResults
  };
};
