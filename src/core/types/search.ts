export interface TextSearchParams {
  query: string;
  limit?: number;
  searchType?: 'text' | 'semantic';
  contentTypes?: string[];
  threshold?: number;
  filters?: Record<string, any>;
}

export interface ImageSearchParams {
  imageUrl?: string;
  imageFile?: File;
  limit?: number;
  threshold?: number;
  filters?: Record<string, any>;
}

export interface HybridSearchParams {
  textQuery?: string;
  imageUrl?: string;
  imageFile?: File;
  limit?: number;
  contentTypes?: string[];
  weights?: {
    text: number;
    image: number;
  };
  threshold?: number;
  filters?: Record<string, any>;
}

export interface SearchResult {
  uid: string;
  contentType: string;
  similarity: number;
  rerankScore?: number;
  title?: string;
  url?: string;
  locale?: string;
  [key: string]: any;
}

export interface SearchResponse {
  success: boolean;
  query?: string;
  queryImage?: string;
  imageUrl?: string;
  results: SearchResult[];
  count: number;
  searchType: 'text' | 'semantic' | 'image' | 'uploaded_image' | 'hybrid';
  metadata?: {
    totalResults: number;
    searchTime: number;
    environment: string;
    reranked?: boolean;
  };
  weights?: {
    text: number;
    image: number;
  };
  uploadedImage?: {
    filename: string;
    size: number;
    mimetype: string;
  };
}

export interface SearchStats {
  success: boolean;
  stats: {
    totalEntries?: number;
    indexedEntries?: number;
    lastIndexed?: string;
  };
  capabilities: {
    textSearch: boolean;
    imageSearch: boolean;
    hybridSearch: boolean;
    uploadSearch: boolean;
  };
}

export interface SearchAnalytics {
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  stats: {
    totalSearches: number;
    successfulSearches: number;
    averageResponseTime: number;
    averageResultsCount: number;
  };
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  errorStats: Array<{
    error: string;
    count: number;
  }>;
}
