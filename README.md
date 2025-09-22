# Contentstack Semantic Search Integration

This repository contains the implementation of a comprehensive semantic search solution for Contentstack CMS. The system enables users to search through their content using natural language queries and image-based searches powered by AI embeddings.

## Repository Links

- **Frontend**: https://github.com/Ajinkya-commits/Semantic_Frontend_App.git
- **Backend**: https://github.com/Ajinkya-commits/Semantic_Search_Backend.git  
- **Image Embeddings Microservice**: https://github.com/Ajinkya-commits/Image-Embedding-Service.git

## Features

- **Text Search**: Search content using natural language queries
- **Image Search**: Upload images to find visually similar content
- **Real-time Indexing**: Automatic content synchronization when content is updated
- **Analytics Dashboard**: View search patterns and performance metrics
- **Contentstack Integration**: Seamless integration with Contentstack marketplace

## Application Interface

After successful installation and setup, your application interface will look like this:

<img width="1101" height="502" alt="Screenshot 2025-09-23 034925" src="https://github.com/user-attachments/assets/5d4057f3-8756-42a9-8d2e-d5e7f80f498f" />

The interface provides:
- **Search Tab**: Text and image search functionality
- **Indexing Tab**: Content management and indexing controls  
- **Analytics Tab**: Search insights and performance metrics

## Features

The semantic search solution provides intelligent content discovery through AI-powered search capabilities. Users can search their Contentstack content using natural language text queries or by uploading images to find visually similar content. The system automatically indexes content when it's published or updated in Contentstack, ensuring search results are always current.

## Workflow

The application follows a simple workflow for content search and management. Users start by installing the app in their Contentstack stack and configuring the necessary webhooks and OAuth settings. Once configured, the system automatically indexes existing content and keeps it synchronized with any changes made in Contentstack. Users can then search through their content using the intuitive interface, with results displayed in an organized, searchable format.

## How It Works

The system operates through three interconnected services working together. The frontend provides the user interface for search and management operations. The backend handles authentication, content processing, and search logic by connecting to Contentstack APIs and managing vector embeddings. The image embedding service processes uploaded images using advanced AI models to generate searchable vector representations. When users perform searches, the system compares query embeddings with stored content embeddings to find the most relevant matches.

## Technologies Used

- **Frontend**: React with TypeScript for the user interface
- **Backend**: Node.js with Express for API services and MongoDB for data storage
- **Image Processing**: Python with Flask and DINOv2 model for image embeddings
- **External Services**: Contentstack CMS, Cohere AI for text embeddings, and Pinecone for vector storage

## Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- Python >= 3.8
- MongoDB (local or cloud)
- Contentstack account with API access

### Step 1: Clone the Repositories

```bash
# Clone frontend
git clone https://github.com/Ajinkya-commits/Semantic_Frontend_App.git

# Clone backend  
git clone https://github.com/Ajinkya-commits/Semantic_Search_Backend.git

# Clone image service
git clone https://github.com/Ajinkya-commits/Image-Embedding-Service.git
```

### Step 2: Setup Contentstack App Configuration

#### Enable UI Location
First, you need to enable the UI location in your Contentstack app configuration:
<img width="1504" height="74" alt="Screenshot 2025-09-23 034636" src="https://github.com/user-attachments/assets/0be12a12-2cd6-405d-83b7-bdcdb7d9ad96" />

This allows your app to be displayed within the Contentstack interface.

#### Setup Webhook with ngrok
Configure webhooks to enable real-time content synchronization:
<img width="582" height="406" alt="Screenshot 2025-09-23 034730" src="https://github.com/user-attachments/assets/4a013337-5c06-42f4-afa4-7115ada6427f" />

1. Install ngrok: `npm install -g ngrok`
2. Expose your local backend: `ngrok http 8000`
3. Copy the ngrok URL and configure it in Contentstack webhooks
4. Enable events for: entry.publish, entry.update, entry.delete, asset.publish, asset.update, asset.delete

#### Setup OAuth Configuration
Configure OAuth for secure authentication:
<img width="514" height="319" alt="Screenshot 2025-09-23 034753" src="https://github.com/user-attachments/assets/7b3ff696-fc16-4db8-92ca-cc998bcb5f79" />

1. Navigate to your app's OAuth settings in Contentstack
2. Configure the redirect URLs
3. Note down your Client ID and Client Secret
4. Add these to your backend environment variables

#### Hosting with Contentstack Launch
Deploy your app using Contentstack Launch:
<img width="518" height="483" alt="Screenshot 2025-09-23 034827" src="https://github.com/user-attachments/assets/ed402cb8-4863-4141-afc2-5dfa08c259c8" />

1. Connect your GitHub repository
2. Configure build settings
3. Deploy to your preferred environment
4. Update your app configuration with the deployed URL

### Step 3: Install Dependencies

#### Backend Setup
```bash
cd Semantic_Search_Backend
npm install
cp src/env.example src/.env
# Configure your API keys in .env
npm run dev
```

#### Image Embedding Service Setup
```bash
cd Image_Embedding_Service
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd Semantic_Frontend_App
npm install
cp .env.sample .env
# Configure environment variables
npm run dev
```

## Troubleshooting

### Common Issues I Encountered and Resolved

#### Issue 1: Python Image Service Connection
**Problem**: Backend couldn't connect to the Python image embedding service.
**Solution**: Ensure the Python service is running on the correct port (5000) and the health endpoint returns the proper status format.

#### Issue 2: Webhook Events Not Triggering
**Problem**: Content updates in Contentstack weren't automatically updating the search index.
**Solution**: Properly configure webhook URLs using ngrok for local development and ensure all required events are enabled in Contentstack.

#### Issue 3: OAuth Token Refresh
**Problem**: Authentication tokens were expiring and not refreshing automatically.
**Solution**: Implement proper token lifecycle management with automatic refresh logic.

#### Issue 4: Contentstack App Sandbox Restrictions
**Problem**: Form submissions were blocked due to iframe sandbox permissions.
**Solution**: Replace form elements with div containers and handle submissions through onClick handlers.

## API Keys Required

You'll need to obtain the following API keys:

1. **Contentstack API Key**: From your Contentstack stack settings
2. **Contentstack Delivery Token**: For content delivery API access
3. **Cohere API Key**: For text embedding generation (https://cohere.ai/)
4. **Pinecone API Key**: For vector database storage (https://pinecone.io/)

## Usage

1. **Install the app** in your Contentstack stack
2. **Configure your content types** for indexing
3. **Run the initial indexing** to populate the search database
4. **Start searching** using text queries or image uploads
5. **Monitor performance** through the analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
