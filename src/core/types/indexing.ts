export interface ReindexParams {
  environment?: string;
  batchSize?: number;
  contentTypes?: string[];
}

export interface ReindexStatus {
  success: boolean;
  status: 'idle' | 'running' | 'completed' | 'failed';
  message?: string;
  indexStats?: {
    totalEntries?: number;
    indexedEntries?: number;
    lastIndexed?: string;
  };
  stackApiKey?: string;
}

export interface ReindexProgress {
  status: 'running' | 'completed' | 'failed';
  processed: number;
  total: number;
  percentage: number;
  currentContentType?: string;
  errors: string[];
  duration?: number;
}

export interface BatchIndexParams {
  entries: Array<{
    uid: string;
    contentType: string;
  }>;
  environment?: string;
}

// Legacy types for backward compatibility
export interface ReindexResponse {
  success: boolean;
  message: string;
  result: {
    totalProcessed: number;
    totalIndexed: number;
    errors: string[];
    duration: number;
  };
}

export interface IndexingStatus {
  success: boolean;
  indexStats: {
    totalEntries?: number;
    indexedEntries?: number;
    lastIndexed?: string;
  };
  indexingStatus: {
    isRunning: boolean;
    progress?: number;
    currentOperation?: string;
  };
  stackApiKey: string;
}

export interface IndexingProgress {
  processed: number;
  total: number;
  percentage: number;
  currentContentType?: string;
  errors: string[];
}
