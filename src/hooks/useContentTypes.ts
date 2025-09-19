import { useState, useEffect } from 'react';
import { configApi } from '../services/api';
import type { ContentType } from '../types';

export const useContentTypes = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const types = await configApi.getContentTypes();
        setContentTypes(types);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content types';
        setError(errorMessage);
        setContentTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContentTypes();
  }, []);

  return {
    contentTypes,
    loading,
    error,
  };
};
