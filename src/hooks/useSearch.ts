import { useState } from 'react';
import { searchAPI } from '../services/api';
import type { SearchResult } from '../core/types/search';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery ?? query;
    if (!q || typeof q !== 'string' || !q.trim()) {
      console.log('Search cancelled - empty or invalid query');
      return;
    }
    setLoading(true);
    setResults([]);
    
    try {
      const response = await searchAPI.semanticSearch({
        query: q,
        topK: 5,
        filters: {
          ...(selectedType && { contentType: selectedType }),
        },
      });
      setResults(response.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setQuery('');
  };

  return {
    query,
    setQuery,
    results,
    loading,
    selectedType,
    setSelectedType,
    handleSearch,
    clearSearch,
  };
};
