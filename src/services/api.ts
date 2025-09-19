import axios from 'axios';
import type {
  SearchParams,
  ImageSearchParams,
  SearchResponse,
  ContentType,
  IndexingStats,
  AnalyticsData
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchApi = {
  searchText: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/text', params);
    return response.data;
  },

  searchSemantic: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/semantic', params);
    return response.data;
  },

  searchByImage: async (params: ImageSearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/image', params);
    return response.data;
  },

  searchByUpload: async (file: File, params?: Partial<ImageSearchParams>): Promise<SearchResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    if (params?.limit) formData.append('limit', params.limit.toString());
    if (params?.filters) formData.append('filters', JSON.stringify(params.filters));

    const response = await apiClient.post('/search/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  searchHybrid: async (params: SearchParams & ImageSearchParams): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/hybrid', params);
    return response.data;
  },

  getAllEntries: async (): Promise<SearchResponse> => {
    const response = await apiClient.get('/search/entries');
    return response.data;
  },

  getAnalytics: async (days = 7): Promise<AnalyticsData> => {
    const response = await apiClient.get(`/search/analytics?days=${days}`);
    return response.data;
  },

  getStats: async (): Promise<any> => {
    const response = await apiClient.get('/search/stats');
    return response.data;
  },
};

export const indexingApi = {
  getStats: async (): Promise<IndexingStats> => {
    const response = await apiClient.get('/sync/stats');
    return response.data;
  },

  startIndexing: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/sync/reindex');
    return response.data;
  },

  indexAll: async (params: { environment: string }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/sync/index-all', params);
    return response.data;
  },

  getProgress: async (): Promise<{ progress: number; status: string }> => {
    const response = await apiClient.get('/sync/progress');
    return response.data;
  },
};

export const configApi = {
  getContentTypes: async (): Promise<ContentType[]> => {
    const response = await apiClient.get('/config/content-types');
    return response.data.contentTypes || [];
  },

  getSystemConfig: async (): Promise<any> => {
    const response = await apiClient.get('/config/system');
    return response.data.config;
  },

  updateSystemConfig: async (config: any): Promise<{ success: boolean }> => {
    const response = await apiClient.put('/config/system', { config });
    return response.data;
  },

  getStackConfig: async (): Promise<any> => {
    const response = await apiClient.get('/config/stack');
    return response.data;
  },
};

export const analyticsApi = {
  getSearchAnalytics: async (days = 7): Promise<AnalyticsData> => {
    const response = await apiClient.get(`/search/analytics?days=${days}`);
    return response.data;
  },

  getPerformanceMetrics: async (hours = 24): Promise<any> => {
    const response = await apiClient.get(`/search/performance?hours=${hours}`);
    return response.data;
  },
};

export const authApi = {
  initiateAuth: async (): Promise<{ authUrl: string }> => {
    const response = await apiClient.get('/auth/contentstack');
    return response.data;
  },

  handleCallback: async (code: string, state: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post('/auth/callback', { code, state });
    return response.data;
  },
};

export const urlUtils = {
  getEntryEditUrl: async (
    contentType: string,
    locale: string,
    uid: string
  ): Promise<string> => {
    const config = await configApi.getStackConfig();
    return `https://eu-app.contentstack.com/#!/stack/${config.stackApiKey}/content-type/${contentType}/${locale}/entry/${uid}/edit?branch=main`;
  },
};

export const getStackApiKey = async (): Promise<string> => {
  const config = await configApi.getStackConfig();
  return config.stackApiKey;
};

export default {
  search: searchApi,
  indexing: indexingApi,
  config: configApi,
  analytics: analyticsApi,
  auth: authApi,
  urlUtils,
};
