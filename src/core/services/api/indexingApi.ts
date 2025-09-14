import { apiClient } from '../apiClient';
import type { 
  ReindexParams, 
  ReindexStatus,
  ReindexProgress,
  BatchIndexParams 
} from '../../types/indexing';

export const indexingApi = {
  // Start reindex process
  startReindex: async (params: ReindexParams): Promise<ReindexStatus> => {
    const response = await apiClient.post('/index/reindex', params);
    return response.data;
  },

  // Get reindex progress
  getReindexProgress: async (): Promise<ReindexProgress> => {
    const response = await apiClient.get('/index/progress');
    return response.data;
  },

  // Get index status
  getIndexStatus: async (): Promise<ReindexStatus> => {
    const response = await apiClient.get('/index/status');
    return response.data;
  },

  // Clear index
  clearIndex: async () => {
    const response = await apiClient.delete('/index/clear');
    return response.data;
  },

  // Batch index specific entries
  batchIndex: async (params: BatchIndexParams) => {
    const response = await apiClient.post('/index/batch', params);
    return response.data;
  },
};
