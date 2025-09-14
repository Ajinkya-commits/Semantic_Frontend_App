import { apiClient } from '../apiClient';
import type { 
  TextSearchParams, 
  ImageSearchParams, 
  HybridSearchParams, 
  SearchResponse,
  SearchStats 
} from '../../types/search';

export const searchApi = {
  // Text-based search
  searchText: async (params: TextSearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/text', params);
    return response.data;
  },

  // Semantic search with reranking
  searchSemantic: async (params: TextSearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/semantic', params);
    return response.data;
  },

  // Image similarity search
  searchByImage: async (params: ImageSearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/image', params);
    return response.data;
  },

  // Upload image and search
  searchByUpload: async (file: File, params?: Partial<ImageSearchParams>): Promise<SearchResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    
    if (params?.limit) formData.append('limit', params.limit.toString());
    if (params?.threshold) formData.append('threshold', params.threshold.toString());
    if (params?.filters) formData.append('filters', JSON.stringify(params.filters));

    const response = await apiClient.post('/search/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Hybrid search (text + image)
  searchHybrid: async (params: HybridSearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/hybrid', params);
    return response.data;
  },

  // Get search analytics
  getAnalytics: async (days?: number) => {
    const response = await apiClient.get('/search/analytics', {
      params: { days }
    });
    return response.data;
  },

  // Get search statistics
  getStats: async (): Promise<SearchStats> => {
    const response = await apiClient.get('/search/stats');
    return response.data;
  },

  // Get all entries (for debugging)
  getAllEntries: async () => {
    const response = await apiClient.get('/search/entries');
    return response.data;
  },
};
