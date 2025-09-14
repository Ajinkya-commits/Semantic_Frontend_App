import { useState } from 'react';
import { searchAPI } from '../services/api';

export interface SearchResult {
  uid: string;
  title: string;
  description: string;
  contentType: string;
  locale: string;
  similarity: number;
  rerankScore: number;
  [key: string]: any;
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = async (searchQuery?: string) => {
    console.log('handleSearch called with:', { searchQuery, currentQuery: query });
    
    const q = searchQuery ?? query;
    console.log('Final query to search:', q);
    
    if (!q || typeof q !== 'string' || !q.trim()) {
      console.log('Search cancelled - empty or invalid query');
      return;
    }

    console.log('Starting search with query:', q.trim());
    setLoading(true);
    setResults([]);
    
    try {
      console.log('Making API call to searchAPI.semanticSearch');
      const response = await searchAPI.semanticSearch({
        query: q,
        topK: 5,
        filters: {
          ...(selectedType && { contentType: selectedType }),
        },
      });

      console.log('API response received:', response);
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
