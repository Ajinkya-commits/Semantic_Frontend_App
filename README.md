# Contentstack Semantic Search Frontend

A React-based frontend application that provides an intuitive interface for semantic search within Contentstack CMS. Built with TypeScript and modern React patterns for a responsive and user-friendly experience.

## Overview

This frontend application serves as the user interface for the Contentstack semantic search system. It allows users to perform text-based, image-based, and hybrid searches across their Contentstack content, manage indexing operations, and view search analytics.

## Architecture

The frontend follows a feature-based modular architecture:

```
src/
├── features/
│   ├── search/          # Search components and logic
│   │   ├── components/  # Search UI components
│   │   ├── hooks/       # Search-related hooks
│   │   └── pages/       # Search page containers
│   └── indexing/        # Content indexing management
│       ├── components/  # Indexing UI components
│       ├── hooks/       # Indexing-related hooks
│       └── pages/       # Indexing page containers
├── shared/
│   ├── components/      # Reusable UI components
│   └── utils/          # Helper functions and utilities
├── core/
│   ├── services/api/   # API integration layer
│   └── types/          # TypeScript type definitions
└── App.tsx             # Main application component
```

## Technology Stack

- **React 18** - Modern UI framework with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API communication
- **Contentstack App SDK** - Integration with Contentstack marketplace

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.sample .env
```

3. Set up your environment variables in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_IMAGE_SERVICE_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Development Challenges and Solutions

### Component Architecture Refactoring

Initially had a single large component (FullPage.tsx) that was over 900 lines long, making it difficult to maintain and test.

**Problem**: The main component was handling search functionality, indexing operations, content type management, and UI state all in one file.

**Solution**: Broke down the monolithic component into smaller, focused components:

- **SearchBox.tsx** (88 lines) - Handles search input and filters
- **SearchResults.tsx** (108 lines) - Displays search results with sorting
- **SearchResultCard.tsx** (171 lines) - Individual result card component
- **ReindexSection.tsx** (127 lines) - Indexing controls and progress
- **EntryDetailsModal.tsx** (295 lines) - Detailed entry view modal
- **LoadingSpinner.tsx** (29 lines) - Reusable loading indicator

Also created custom hooks for state management:
- **useSearch.ts** (62 lines) - Search state and API calls
- **useReindex.ts** (68 lines) - Indexing state and progress tracking
- **useContentTypes.ts** (32 lines) - Content types fetching

### TypeScript Integration Issues

Encountered multiple TypeScript errors due to inconsistent type definitions across components.

**Problem**: Components were expecting different data structures, causing type mismatches and compilation errors.

**Solution**: Implemented a comprehensive type system with proper interfaces:

```typescript
// Core search types
export interface SearchResult {
  id: string;
  score: number;
  metadata: {
    entryUid: string;
    contentType: string;
    title: string;
    url?: string;
  };
  entryData?: any;
}

export interface SearchParams {
  query: string;
  topK?: number;
  filters?: Record<string, any>;
  threshold?: number;
}
```

### Contentstack App Integration

Had to solve iframe sandbox restrictions when running inside the Contentstack marketplace app environment.

**Problem**: Form submissions were being blocked due to iframe sandbox permissions, causing "Blocked form submission" errors.

**Root Cause**: Contentstack apps run in sandboxed iframes without 'allow-forms' permission.

**Solution**: Replaced form elements with div containers and handled submissions through onClick handlers:

```typescript
// Before: Form-based approach (blocked)
<form onSubmit={handleSubmit}>
  <button type="submit">Search</button>
</form>

// After: Event-based approach (works)
<div>
  <button type="button" onClick={handleSubmit}>Search</button>
</div>
```

### Stack Detection and Isolation

Needed to properly detect which Contentstack stack the app was running in to ensure data isolation.

**Problem**: Multiple stack installations were seeing each other's data due to insufficient stack context detection.

**Solution**: Implemented multiple stack detection methods:

1. URL parameter extraction from Contentstack app URLs
2. Hash-based detection from iframe context
3. Parent window communication via postMessage
4. Contentstack SDK integration
5. localStorage fallback for persistence

```typescript
const detectStackFromUrl = (): string | null => {
  const urlPatterns = [
    /\/stack\/([^\/]+)/,
    /#!\/stack\/([^\/]+)/,
    /stackApiKey=([^&]+)/
  ];
  
  for (const pattern of urlPatterns) {
    const match = window.location.href.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};
```

### API Service Architecture

Initially had a monolithic API service that was difficult to maintain and test.

**Problem**: Single large API service file with mixed responsibilities.

**Solution**: Refactored into feature-based API modules:

- **searchApi.ts** - Search-related API calls
- **indexingApi.ts** - Content indexing operations
- **configApi.ts** - Configuration management
- **authApi.ts** - Authentication operations
- **apiClient.ts** - Shared HTTP client with interceptors

### Content Type Display Issues

Content type dropdowns were showing technical UIDs instead of user-friendly names.

**Problem**: The useContentTypes hook was returning string arrays of UIDs instead of full content type objects.

**Solution**: Updated the hook to fetch complete content type data:

```typescript
// Before: Only UIDs
const contentTypes: string[] = ['blog_post', 'product', 'author'];

// After: Full objects with display names
const contentTypes: ContentType[] = [
  { uid: 'blog_post', title: 'Blog Post', description: '...' },
  { uid: 'product', title: 'Product', description: '...' },
  { uid: 'author', title: 'Author', description: '...' }
];
```

## Features

### Multi-Modal Search Interface
- **Text Search**: Semantic search with natural language queries
- **Image Search**: Upload images or provide URLs for visual similarity search
- **Hybrid Search**: Combine text and image queries with adjustable weights

### Content Management
- **Real-time Indexing**: Monitor indexing progress with live updates
- **Batch Operations**: Efficient processing of large content volumes
- **Content Type Filtering**: Filter search results by content type

### User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Clear feedback during API operations
- **Error Handling**: User-friendly error messages and recovery options
- **Search Analytics**: View search patterns and performance metrics

## API Integration

The frontend communicates with the backend API and image processing service:

```typescript
// Search API integration
const searchText = async (params: TextSearchParams): Promise<SearchResponse> => {
  const response = await apiClient.get('/api/search/text', { params });
  return response.data;
};

// Image search with file upload
const searchByUploadedImage = async (file: File, params: ImageSearchParams) => {
  const formData = new FormData();
  formData.append('image', file);
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  
  const response = await apiClient.post('/api/search/image/upload', formData);
  return response.data;
};
```

## Testing

Run the test suite:
```bash
npm run test:chrome
```

Run tests in Firefox:
```bash
npm run test:firefox
```

Run tests with browser UI:
```bash
npm run test:chrome-headed
```

## Code Quality

Type checking:
```bash
npm run typecheck
```

Linting:
```bash
npm run lint
```

Code formatting:
```bash
npm run format
```

## Build and Deployment

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The built application will be in the `dist/` directory and can be deployed to any static hosting service.

## Contentstack Marketplace Integration

This application is designed to run as a Contentstack marketplace app. It integrates with the Contentstack App SDK for:

- Authentication and authorization
- Stack context detection
- Iframe communication
- Content entry navigation

## Browser Support

The application supports modern browsers with ES2020+ features:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Create a feature branch from main
2. Make your changes following the established patterns
3. Add tests for new components and functionality
4. Ensure TypeScript compilation passes
5. Submit a pull request with a clear description

## License

MIT License - see LICENSE file for details.
