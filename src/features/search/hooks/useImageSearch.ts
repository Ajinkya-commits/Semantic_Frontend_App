import { useState } from 'react';
import { searchApi } from '../../../core/services/api/searchApi';
import type { SearchResult, ImageSearchParams, SearchResponse } from '../../../core/types/search';

export interface UseImageSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  searchByImage: (params: ImageSearchParams) => Promise<void>;
  clearResults: () => void;
}

export const useImageSearch = (): UseImageSearchReturn => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByImage = async (params: ImageSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await searchApi.searchByImage(params);
      setResults(response.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image search failed';
      setError(errorMessage);
      console.error('Image search error:', err);
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
    searchByImage,
    clearResults
  };
};
