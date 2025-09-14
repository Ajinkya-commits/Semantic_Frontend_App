import { useState } from 'react';
import { indexingApi } from '../../../core/services/api/indexingApi';
import type { ReindexParams, ReindexStatus, ReindexProgress } from '../../../core/types/indexing';

export const useIndexing = () => {
  const [reindexStatus, setReindexStatus] = useState<ReindexStatus | null>(null);
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexProgress, setReindexProgress] = useState<ReindexProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startReindex = async (params: ReindexParams) => {
    try {
      setIsReindexing(true);
      setError(null);
      setReindexProgress(null);
      
      const result = await indexingApi.startReindex(params);
      setReindexStatus(result);
      
      // Start polling for progress
      pollProgress();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reindex failed';
      setError(errorMessage);
      console.error('Reindex error:', err);
      setIsReindexing(false);
    }
  };

  const pollProgress = async () => {
    const pollInterval = setInterval(async () => {
      try {
        const progress = await indexingApi.getReindexProgress();
        setReindexProgress(progress);
        
        if (progress.status === 'completed' || progress.status === 'failed') {
          clearInterval(pollInterval);
          setIsReindexing(false);
          
          if (progress.status === 'failed') {
            setError('Reindexing failed');
          }
        }
      } catch (err) {
        console.error('Progress polling error:', err);
        clearInterval(pollInterval);
        setIsReindexing(false);
      }
    }, 2000); // Poll every 2 seconds
  };

  const clearIndex = async () => {
    try {
      setError(null);
      await indexingApi.clearIndex();
      setReindexStatus(null);
      setReindexProgress(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Clear index failed';
      setError(errorMessage);
      console.error('Clear index error:', err);
    }
  };

  const getIndexStatus = async () => {
    try {
      setError(null);
      const status = await indexingApi.getIndexStatus();
      setReindexStatus(status);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Get status failed';
      setError(errorMessage);
      console.error('Get status error:', err);
    }
  };

  return {
    reindexStatus,
    isReindexing,
    reindexProgress,
    error,
    startReindex,
    clearIndex,
    getIndexStatus
  };
};
