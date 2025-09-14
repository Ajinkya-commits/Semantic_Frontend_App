import { apiClient } from '../apiClient';
import type { 
  FieldConfig, 
  SystemConfig, 
  ContentType,
  UpdateFieldConfigParams 
} from '../../types/config';

export const configApi = {
  // Get field configurations
  getFieldConfigs: async (): Promise<FieldConfig[]> => {
    const response = await apiClient.get('/config/fields');
    return response.data.fieldConfigs;
  },

  // Update field configurations
  updateFieldConfigs: async (params: UpdateFieldConfigParams) => {
    const response = await apiClient.post('/config/fields', params);
    return response.data;
  },

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
