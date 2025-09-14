export interface OAuthResponse {
  success: boolean;
  authUrl: string;
  message: string;
}

export interface TokenData {
  success: boolean;
  message: string;
  stackApiKey: string;
  expiresAt: string;
}

export interface RefreshTokenParams {
  stackApiKey: string;
}

export interface ActiveToken {
  stackApiKey: string;
  stackName: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  lastUsed: string;
}

export interface ActiveTokensResponse {
  success: boolean;
  tokens: ActiveToken[];
  count: number;
}
