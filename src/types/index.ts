export interface SearchParams {
  query: string;
  limit?: number;
  filters?: Record<string, any>;
  useReranking?: boolean;
  contentTypes?: string[];
}

export interface ImageSearchParams {
  imageUrl?: string;
  limit?: number;
  filters?: Record<string, any>;
}

export interface SearchResult {
  uid: string;
  title: string;
  content_type_uid: string;
  contentType: string;
  similarity: number;
  rerankScore?: number;
  content?: any;
  locale?: string;
  updated_at?: string;
  contentTypes: ContentType[];
  [key: string]: any;
}

export interface SearchResponse {
  success: boolean;
  query?: string;
  results: SearchResult[];
  total: number;
  metadata?: {
    searchTime: number;
    totalResults: number;
    reranked: boolean;
  };
}

export interface ContentType {
  uid: string;
  title: string;
  description?: string;
  schema?: any[];
}

export interface IndexingStats {
  success: boolean;
  stats: {
    totalVectors: number;
    dimensions: number;
    indexFullness: number;
    namespaces: Record<string, any>;
    totalEntries: number;
    lastUpdated: string;
    indexName: string;
    status: string;
  };
  stackApiKey: string;
  totalVectors: number;
  dimensions: number;
  indexInfo: {
    totalVectors: number;
    dimensions: number;
    lastUpdated: string;
  };
}

export interface AnalyticsData {
  stats: {
    totalSearches: number;
    successfulSearches: number;
    averageResponseTime: number;
    averageResultsCount: number;
  };
  popularQueries: Array<{ query: string; count: number }>;
  searchTrends?: Array<{ date: string; count: number }>;
  indexInfo?: {
    totalVectors: number;
    dimensions: number;
    lastUpdated: string | null;
  };
  capabilities?: {
    textSearch: boolean;
    imageSearch: boolean;
    hybridSearch: boolean;
    uploadSearch: boolean;
  };
}

export interface AppConfig {
  stackApiKey: string;
  environment: string;
  region: string;
}

export interface SearchFilters {
  contentTypes?: string[];
  locale?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}
