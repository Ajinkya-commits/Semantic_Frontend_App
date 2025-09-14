import { SearchResult } from '../../core/types/search';
import { ContentType } from '../../core/types/config';

/**
 * Filter search results based on similarity and rerank scores
 */
export const filterSearchResults = (
  results: SearchResult[],
  minSimilarity: number = 0.7,
  minRerank: number = 0.5,
  maxResults: number = 10
): SearchResult[] => {
  return results
    .filter((result) => {
      const similarityPass = (result.similarity ?? 0) >= minSimilarity;
      const rerankPass = (result.rerankScore ?? 0) >= minRerank;
      return similarityPass || rerankPass;
    })
    .sort((a, b) => (b.rerankScore ?? 0) - (a.rerankScore ?? 0))
    .slice(0, maxResults);
};

/**
 * Format score values for display
 */
export const formatScore = (score: number | undefined, decimals: number = 3): string => {
  return score ? score.toFixed(decimals) : 'N/A';
};

/**
 * Get color based on score value and threshold
 */
export const getScoreColor = (score: number | undefined, threshold: number): string => {
  if (!score) return '#6c757d';
  return score >= threshold ? '#28a745' : score >= threshold * 0.7 ? '#ffc107' : '#dc3545';
};

/**
 * Generate Contentstack entry URL
 */
export const generateContentstackUrl = (
  stackApiKey: string,
  contentType: string,
  locale: string,
  uid: string,
  branch: string = 'main'
): string => {
  return `https://eu-app.contentstack.com/#!/stack/${stackApiKey}/content-type/${contentType}/${locale}/entry/${uid}/edit?branch=${branch}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get content type display name
 */
export const getContentTypeDisplayName = (
  contentTypeId: string,
  contentTypes: ContentType[]
): string => {
  const contentType = contentTypes.find(ct => ct.uid === contentTypeId);
  return contentType?.title || contentTypeId;
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query: string): { isValid: boolean; error?: string } => {
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: 'Search query cannot be empty' };
  }
  
  if (query.trim().length < 2) {
    return { isValid: false, error: 'Search query must be at least 2 characters long' };
  }
  
  if (query.length > 500) {
    return { isValid: false, error: 'Search query cannot exceed 500 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate image URL
 */
export const validateImageUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url || url.trim().length === 0) {
    return { isValid: false, error: 'Image URL cannot be empty' };
  }
  
  try {
    new URL(url);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
  
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const hasValidExtension = supportedExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  if (!hasValidExtension) {
    return { 
      isValid: false, 
      error: `Supported formats: ${supportedExtensions.join(', ')}` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  
  if (!supportedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Unsupported file type. Please use JPEG, PNG, GIF, BMP, or WebP.' 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File size cannot exceed 10MB' 
    };
  }
  
  return { isValid: true };
};

/**
 * Debounce function for search input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.power(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extract metadata from search result for display
 */
export const extractDisplayMetadata = (result: SearchResult): Record<string, any> => {
  const excludedFields = [
    'title', 'description', 'similarity', 'rerankScore', 
    'contentType', 'locale', 'uid'
  ];
  
  return Object.entries(result)
    .filter(([key, value]) => 
      !excludedFields.includes(key) &&
      value !== null &&
      value !== undefined &&
      value !== ''
    )
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);
};
