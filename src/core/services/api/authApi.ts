import { apiClient } from '../apiClient';
import type { 
  OAuthResponse, 
  TokenData, 
  RefreshTokenParams 
} from '../../types/auth';

export const authApi = {
  // Initiate OAuth flow
  initiateOAuth: async (): Promise<OAuthResponse> => {
    const response = await apiClient.get('/auth/oauth/authorize');
    return response.data;
  },

  // Handle OAuth callback
  handleCallback: async (code: string, state?: string): Promise<TokenData> => {
    const response = await apiClient.post('/auth/oauth/callback', { code, state });
    return response.data;
  },

  // Refresh OAuth token
  refreshToken: async (params: RefreshTokenParams): Promise<TokenData> => {
    const response = await apiClient.post('/auth/oauth/refresh', params);
    return response.data;
  },

  // Get active tokens
  getActiveTokens: async () => {
    const response = await apiClient.get('/auth/tokens');
    return response.data;
  },

  // Revoke token
  revokeToken: async (stackApiKey: string) => {
    const response = await apiClient.delete(`/auth/tokens/${stackApiKey}`);
    return response.data;
  },
};
