import { apiClient } from '../apiClient';
import type { 
  SystemConfig, 
  ContentType
} from '../../types/config';

export const configApi = {
  // Get system configuration
  getSystemConfig: async (): Promise<SystemConfig> => {
    const response = await apiClient.get('/config/system');
    return response.data.config;
  },

  // Update system configuration
  updateSystemConfig: async (config: Partial<SystemConfig>) => {
    const response = await apiClient.post('/config/system', { config });
    return response.data;
  },

  // Get content types
  getContentTypes: async (environment?: string): Promise<ContentType[]> => {
    const response = await apiClient.get('/config/content-types', {
      params: { environment }
    });
    return response.data.contentTypes;
  },
};
