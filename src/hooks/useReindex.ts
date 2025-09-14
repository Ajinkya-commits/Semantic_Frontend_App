import { useState } from 'react';
import { syncAPI } from '../services/api';

export interface ReindexResults {
  indexed: number;
  skipped: number;
  errors: number;
  totalProcessed: number;
}

export const useReindex = () => {
  const [reindexing, setReindexing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reindexResults, setReindexResults] = useState<ReindexResults | null>(null);

  const handleReindex = async () => {
    setReindexing(true);
    setProgress(0);
    setReindexResults(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 1000);

    try {
      const response = await syncAPI.indexAll({ environment: 'development' });
      
      clearInterval(progressInterval);
      setProgress(100);

      if (response.results) {
        setReindexResults(response.results);
        
        setTimeout(() => {
          setReindexResults(null);
        }, 5000);
      } else {
        setReindexResults({ indexed: 0, skipped: 0, errors: 0, totalProcessed: 0 });
        
        setTimeout(() => {
          setReindexResults(null);
        }, 5000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Reindexing failed:', error);
      throw error;
    } finally {
      setReindexing(false);
    }
  };

  const clearReindexResults = () => {
    setReindexResults(null);
  };

  return {
    reindexing,
    progress,
    reindexResults,
    handleReindex,
    clearReindexResults,
  };
};
