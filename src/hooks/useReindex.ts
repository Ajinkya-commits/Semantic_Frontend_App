import { useState, useCallback } from 'react';
import { indexingApi } from '../services/api';

export interface ReindexResults {
  success: boolean;
  message?: string;
  indexed?: number;
  skipped?: number;
  errors?: number;
  totalProcessed?: number;
}

export const useReindex = () => {
  const [reindexing, setReindexing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reindexResults, setReindexResults] = useState<ReindexResults | null>(null);

  const handleReindex = useCallback(async () => {
    setReindexing(true);
    setProgress(0);
    setReindexResults(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await indexingApi.startIndexing();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setReindexResults(response);
        setReindexing(false);
      }, 1000);

    } catch (error) {
      setReindexResults({
        success: false,
        message: error instanceof Error ? error.message : 'Reindexing failed'
      });
      setReindexing(false);
      setProgress(0);
    }
  }, []);

  const clearReindexResults = useCallback(() => {
    setReindexResults(null);
    setProgress(0);
  }, []);

  return {
    reindexing,
    progress,
    reindexResults,
    handleReindex,
    clearReindexResults,
  };
};
