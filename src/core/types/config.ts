export interface FieldConfig {
  stackApiKey: string;
  contentType: string;
  fieldUid: string;
  includeInEmbedding: boolean;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateFieldConfigParams {
  configs: Array<{
    contentType: string;
    fieldUid: string;
    includeInEmbedding: boolean;
    weight: number;
  }>;
}

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
