import { useState, useEffect } from 'react';
import { searchAPI } from '../services/api';

export const useContentTypes = () => {
  const [contentTypes, setContentTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await searchAPI.getAllEntries();
        const typesSet = new Set<string>();

        if (Array.isArray(response.entries)) {
          response.entries.forEach((entryGroup: any) => {
            if (entryGroup?.contentType) {
              typesSet.add(entryGroup.contentType);
            }
          });
        }

        setContentTypes(Array.from(typesSet));
      } catch (error) {
        console.error('Failed to fetch content types:', error);
      }
    };

    fetchContentTypes();
  }, []);

  return { contentTypes };
};
