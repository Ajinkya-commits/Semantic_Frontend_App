export interface SystemConfig {
  embedding: {
    model: string;
    dimensions: number;
    batchSize: number;
  };
  vectorSearch: {
    provider: string;
    topK: number;
    threshold: number;
  };
  indexing: {
    batchSize: number;
    maxRetries: number;
  };
}

export interface ContentType {
  uid: string;
  title: string;
  description?: string;
  schema: Array<{
    uid: string;
    data_type: string;
    display_name: string;
    mandatory?: boolean;
  }>;
}
