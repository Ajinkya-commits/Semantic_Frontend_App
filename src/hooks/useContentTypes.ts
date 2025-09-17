import { useState, useEffect } from 'react';
import { configApi } from '../core/services/api/configApi';
import type { ContentType } from '../core/types/config';

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
      } catch (error) {
        console.error('Failed to fetch content types:', error);
        setError('Failed to fetch content types');
        setContentTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContentTypes();
  }, []);

  return { contentTypes, loading, error };
};
