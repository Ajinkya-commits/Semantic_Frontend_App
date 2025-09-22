# Contentstack Semantic Search Integration

This repository contains the implementation of a comprehensive semantic search solution for Contentstack CMS. The system enables users to search through their content using natural language queries and image-based searches powered by AI embeddings.

## Repository Links

- **Frontend**: https://github.com/Ajinkya-commits/Semantic_Frontend_App.git
- **Backend**: https://github.com/Ajinkya-commits/Semantic_Search_Backend.git  
- **Image Embeddings Microservice**: https://github.com/Ajinkya-commits/Image-Embedding-Service.git

## Features

- **Multi-Modal Search**: Search using text queries, image uploads, or hybrid combinations
- **Real-time Indexing**: Automatic content synchronization with progress tracking
- **Analytics Dashboard**: View search patterns and performance metrics
- **Contentstack Integration**: Seamless integration with Contentstack marketplace
- **AI-Powered**: Uses Cohere for text embeddings and DINOv2 for image embeddings

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

![Enable UI Location](path-to-screenshot-1)

This allows your app to be displayed within the Contentstack interface.

#### Setup Webhook with ngrok
Configure webhooks to enable real-time content synchronization:

![Webhook Configuration](path-to-screenshot-2)

1. Install ngrok: `npm install -g ngrok`
2. Expose your local backend: `ngrok http 8000`
3. Copy the ngrok URL and configure it in Contentstack webhooks
4. Enable events for: entry.publish, entry.update, entry.delete, asset.publish, asset.update, asset.delete

#### Setup OAuth Configuration
Configure OAuth for secure authentication:

![OAuth Setup](path-to-screenshot-3)

1. Navigate to your app's OAuth settings in Contentstack
2. Configure the redirect URLs
3. Note down your Client ID and Client Secret
4. Add these to your backend environment variables

#### Hosting with Contentstack Launch
Deploy your app using Contentstack Launch:

![Contentstack Launch](path-to-screenshot-4)

1. Connect your GitHub repository
2. Configure build settings
3. Deploy to your preferred environment
4. Update your app configuration with the deployed URL

### Step 3: Install Dependencies

#### Backend Setup
```bash
cd Semantic_Search_Backend
npm install

# Create environment file
cp src/env.example src/.env

# Configure your API keys in .env
CONTENTSTACK_API_KEY=your_contentstack_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_ENVIRONMENT=development
COHERE_API_KEY=your_cohere_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
MONGODB_URI=mongodb://localhost:27017/contentstack-search

# Start the server
npm run dev
```

#### Image Embedding Service Setup
```bash
cd Image_Embedding_Service
pip install -r requirements.txt

# Start the Python service
python app.py
```

#### Frontend Setup
```bash
cd Semantic_Frontend_App
npm install

# Configure environment
cp .env.sample .env

# Set up your environment variables in .env
VITE_API_BASE_URL=http://localhost:8000
VITE_IMAGE_SERVICE_URL=http://localhost:5000

# Start the development server
npm run dev
```

## Application Interface

After successful installation and setup, your application interface will look like this:

![Application Interface](path-to-screenshot-5)

The interface provides:
- **Search Tab**: Multi-modal search functionality
- **Indexing Tab**: Content management and indexing controls  
- **Analytics Tab**: Search insights and performance metrics

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

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express.js, MongoDB
- **Image Processing**: Python, Flask, PyTorch, DINOv2
- **External Services**: Contentstack CMS, Cohere AI, Pinecone Vector DB

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
