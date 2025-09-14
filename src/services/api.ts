import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Stack configuration interface
interface StackConfig {
  stackApiKey: string;
  managementToken: string;
  environment: string;
}

// Cache for stack configuration
let stackConfigCache: StackConfig;

export const constants = {
  MIN_SIMILARITY_SCORE: 0.3,
  MIN_RERANK_SCORE: 0.5,
};

// Function to fetch stack configuration from backend
export const getStackConfig = async (): Promise<StackConfig> => {
  if (stackConfigCache) {
    return stackConfigCache;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/config/stack`);
    stackConfigCache = response.data;
    return stackConfigCache;
  } catch (error) {
    console.error('Failed to fetch stack configuration:', error);
    throw new Error('Unable to fetch stack configuration');
  }
};

// Function to get stack API key
export const getStackApiKey = async (): Promise<string> => {
  const config = await getStackConfig();
  return config.stackApiKey;
};

export const searchAPI = {
  semanticSearch: async (params: {
    query: string;
    topK: number;
    filters: Record<string, any>;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/search/semantic`, params);
    return response.data;
  },

  getAllEntries: async () => {
    const response = await axios.get(`${API_BASE_URL}/search/entries`);
    return response.data;
  },
};

export const syncAPI = {
  indexAll: async (params: { environment: string }) => {
    const response = await axios.post(`${API_BASE_URL}/sync/index-all`, params);
    return response.data;
  },
};

export const urlUtils = {
  generateContentstackUrl: async (
    contentType: string,
    locale: string,
    uid: string
  ) => {
    const stackApiKey = await getStackApiKey();
    return `https://eu-app.contentstack.com/#!/stack/${stackApiKey}/content-type/${contentType}/${locale}/entry/${uid}/edit?branch=main`;
  },
};
