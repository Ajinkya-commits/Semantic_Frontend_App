import axios from 'axios';
import type {
  SearchParams,
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

export const searchText = async (params: SearchParams): Promise<SearchResponse> => {
  const response = await apiClient.post('/search/text', params);
  return response.data;
};

export const searchSemantic = async (params: SearchParams): Promise<SearchResponse> => {
  const response = await apiClient.post('/search/semantic', params);
  return response.data;
};

export const getAllEntries = async (): Promise<SearchResponse> => {
  const response = await apiClient.get('/search/entries');
  return response.data;
};

export const getSearchStats = async (): Promise<any> => {
  const response = await apiClient.get('/search/stats');
  return response.data;
};

export const indexImages = async (): Promise<{ success: boolean; message: string; indexed: number; total: number }> => {
  const response = await apiClient.post('/image-search/index');
  return response.data;
};

export const searchImagesByUrl = async (imageUrl: string, limit = 10): Promise<SearchResponse> => {
  const response = await apiClient.post('/image-search/search', {
    imageUrl,
    limit
  });
  return response.data;
};

export const searchImagesByUpload = async (file: File, limit = 10): Promise<SearchResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('limit', limit.toString());

  const response = await apiClient.post('/image-search/search/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getIndexingStats = async (): Promise<IndexingStats> => {
  const response = await apiClient.get('/sync/stats');
  return response.data;
};

export const startIndexing = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/sync/reindex');
  return response.data;
};

export const indexAll = async (params: { environment: string }): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/sync/index-all', params);
  return response.data;
};

export const getContentTypes = async (): Promise<ContentType[]> => {
  const response = await apiClient.get('/config/content-types');
  return response.data.contentTypes || [];
};

export const getStackConfig = async (): Promise<any> => {
  const response = await apiClient.get('/config/stack');
  return response.data;
};

export const getAnalyticsData = async (days = 7): Promise<AnalyticsData> => {
  const response = await apiClient.get(`/search/analytics?days=${days}`);
  return response.data;
};

export const initiateAuth = async (): Promise<{ authUrl: string }> => {
  const response = await apiClient.get('/auth/contentstack');
  return response.data;
};

export const getStackApiKey = async (): Promise<string> => {
  const config = await getStackConfig();
  return config.stackApiKey;
};

export const searchApi = {
  searchText,
  searchSemantic,
  getAllEntries,
  getAnalytics: getAnalyticsData,
  getStats: getSearchStats,
};

export const imageSearchApi = {
  indexImages,
  searchByImageUrl: searchImagesByUrl,
  searchByUpload: searchImagesByUpload,
};

export const indexingApi = {
  getStats: getIndexingStats,
  startIndexing,
  indexAll,
};

export const configApi = {
  getContentTypes,
  getStackConfig,
};

export const analyticsApi = {
  getSearchAnalytics: getAnalyticsData,
};

export const authApi = {
  initiateAuth,
};

export default {
  search: searchApi,
  imageSearch: imageSearchApi,
  indexing: indexingApi,
  config: configApi,
  analytics: analyticsApi,
  auth: authApi,
};
