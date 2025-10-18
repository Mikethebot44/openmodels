# OpenModels

SDK for calling open-source models with a consistent API, similar to OpenAI but focused on open-source models hosted on Modal or elsewhere. Supports text generation, embeddings, and image generation.

## Installation

```bash
npm install openmodels
```

## Quick Start

### Text Generation

```typescript
import { client } from 'openmodels';

const openmodels = client({
  baseUrl: 'https://your-modal-app.modal.run', // Your deployed Modal URL
});

const response = await openmodels.chat({
  model: 'microsoft/DialoGPT-medium',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing in simple terms.' }
  ],
  max_tokens: 200,
  temperature: 0.7
});

console.log(response.choices[0].message.content);
```

### Streaming Text Generation

```typescript
import { client } from 'openmodels';

const openmodels = client({
  baseUrl: 'https://your-modal-app.modal.run',
});

const stream = await openmodels.chat({
  model: 'microsoft/DialoGPT-medium',
  messages: [
    { role: 'user', content: 'Write a short poem about AI.' }
  ],
  stream: true
}) as AsyncGenerator<string, void, unknown>;

for await (const token of stream) {
  process.stdout.write(token);
}
```

### Text Embeddings

```typescript
import { client } from 'openmodels';

const openmodels = client({
  baseUrl: 'https://your-embed-modal-app.modal.run',
});

const response = await openmodels.embed({
  model: 'sentence-transformers/all-MiniLM-L6-v2',
  input: 'The quick brown fox jumps over the lazy dog.',
});

console.log(`Embedding dimensions: ${response.data[0].embedding.length}`);
console.log(`First 5 values: [${response.data[0].embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
```

### Batch Embeddings

```typescript
const texts = [
  'Artificial intelligence is transforming the world.',
  'Machine learning algorithms can process vast amounts of data.',
  'Natural language processing enables computers to understand human language.'
];

const response = await openmodels.embed({
  model: 'sentence-transformers/all-MiniLM-L6-v2',
  input: texts,
});

console.log(`Generated ${response.data.length} embeddings`);
```

### Image Generation

```typescript
import { client } from 'openmodels';
import * as fs from 'fs';

const openmodels = client({
  baseUrl: 'https://your-image-modal-app.modal.run',
});

const response = await openmodels.image({
  model: 'stabilityai/stable-diffusion-xl-base-1.0',
  prompt: 'A beautiful sunset over a mountain landscape with a lake in the foreground, digital art style',
  size: '1024x1024',
  quality: 'standard',
  n: 1
});

// Save the generated image
if (response.data[0].b64_json) {
  const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
  fs.writeFileSync('generated_image.png', imageBuffer);
  console.log('Image saved!');
}
```

## CLI Tool

OpenModels includes a powerful command-line interface for quick interactions:

### Installation

```bash
npm install -g openmodels
```

### Basic Usage

```bash
# Chat with AI models
openmodels chat "Explain quantum computing"
openmodels chat "Write a poem" --model microsoft/DialoGPT-medium --stream

# Generate embeddings
openmodels embed "The quick brown fox" --model sentence-transformers/all-MiniLM-L6-v2

# Generate images
openmodels image "A beautiful sunset over mountains" --model stabilityai/stable-diffusion-xl-base-1.0

# List available models
openmodels models
openmodels models --type text
openmodels models --type embed
openmodels models --type image

# Interactive chat mode
openmodels chat --interactive

# Configuration
openmodels config set base-url https://your-modal-app.modal.run
openmodels config set api-key your-api-key
openmodels config list
```

### CLI Commands

- `openmodels chat [message]` - Chat with AI models
- `openmodels embed <text>` - Generate text embeddings
- `openmodels image <prompt>` - Generate images from text
- `openmodels models` - List available models
- `openmodels config` - Manage configuration

## Framework Integrations

### LangChain Integration

```typescript
import { OpenModelsLLM, OpenModelsEmbeddings } from 'openmodels/integrations/langchain';

// Initialize LLM
const llm = new OpenModelsLLM(
  { baseUrl: 'https://your-modal-app.modal.run' },
  { model: 'microsoft/DialoGPT-medium' }
);

// Initialize Embeddings
const embeddings = new OpenModelsEmbeddings(
  { baseUrl: 'https://your-embed-app.modal.run' },
  { model: 'sentence-transformers/all-MiniLM-L6-v2' }
);

// Use with LangChain
import { ConversationChain } from 'langchain/chains';
const chain = new ConversationChain({ llm });
const response = await chain.call({ input: "Hello!" });
```

### LlamaIndex Integration

```python
from openmodels_llamaindex import OpenModelsLLM, OpenModelsEmbedding
from llama_index import VectorStoreIndex, Document

# Initialize components
llm = OpenModelsLLM(
    base_url="https://your-modal-app.modal.run",
    model="microsoft/DialoGPT-medium"
)

embeddings = OpenModelsEmbedding(
    base_url="https://your-embed-app.modal.run",
    model="sentence-transformers/all-MiniLM-L6-v2"
)

# Create index and query
documents = [Document(text="Your document content")]
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("Your question")
```

## Configuration

The client accepts the following configuration options:

```typescript
const openmodels = client({
  apiKey?: string,     // Optional API key for authentication
  baseUrl?: string,   // Base URL for the API (default: Modal endpoint)
});
```

## API Reference

### `client(config?)`

Creates a new OpenModels client instance.

**Parameters:**
- `config` (optional): Configuration object
  - `apiKey` (optional): API key for authentication
  - `baseUrl` (optional): Base URL for the API endpoint

**Returns:** `OpenModels` client instance

### `chat(request)`

Sends a chat completion request.

**Parameters:**
- `request`: Chat completion request object
  - `model`: Model identifier (e.g., 'meta/llama-3-8b')
  - `messages`: Array of message objects with `role` and `content`
  - `max_tokens` (optional): Maximum tokens to generate (default: 200)
  - `temperature` (optional): Sampling temperature (default: 0.7)
  - `stream` (optional): Whether to stream the response (default: false)

**Returns:** 
- If `stream: false`: `ChatCompletionResponse` object
- If `stream: true`: `AsyncGenerator<string, void, unknown>` for streaming tokens

### `embed(request)`

Generates text embeddings for semantic search and similarity analysis.

**Parameters:**
- `request`: Embedding request object
  - `model`: Embedding model identifier (e.g., 'sentence-transformers/all-MiniLM-L6-v2')
  - `input`: Text string or array of strings to embed
  - `encoding_format` (optional): 'float' or 'base64' (default: 'float')

**Returns:** `EmbeddingResponse` object with embedding vectors and usage information

### `image(request)`

Generates images from text prompts using diffusion models.

**Parameters:**
- `request`: Image generation request object
  - `model`: Image model identifier (e.g., 'stabilityai/stable-diffusion-xl-base-1.0')
  - `prompt`: Text description of the image to generate
  - `size` (optional): Image dimensions - '256x256', '512x512', '1024x1024', '1024x1792', '1792x1024' (default: '1024x1024')
  - `quality` (optional): 'standard' or 'hd' (default: 'standard')
  - `n` (optional): Number of images to generate (default: 1)
  - `style` (optional): 'vivid' or 'natural' (default: 'vivid')

**Returns:** `ImageResponse` object with base64-encoded images

## Modal Backend Deployment

### Prerequisites

1. Install Modal CLI: `pip install modal`
2. Set up Modal account: `modal token new`

### Deploy the Backends

1. Navigate to the modal_backend directory:
   ```bash
   cd modal_backend
   ```

2. Deploy the text inference app:
   ```bash
   modal deploy text_inference.py
   ```

3. Deploy the embedding app:
   ```bash
   modal deploy embed_inference.py
   ```

4. Deploy the image generation app:
   ```bash
   modal deploy image_inference.py
   ```

5. Note the deployed URLs and update your client configurations accordingly

### Backend Features

- **Text Generation**: Supports any Hugging Face text generation model
- **Embeddings**: Uses sentence-transformers for high-quality embeddings
- **Image Generation**: Stable Diffusion models for text-to-image generation
- **Persistent Model Loading**: Uses Modal's caching to avoid cold starts
- **GPU Acceleration**: Runs on A10G GPU for fast inference
- **Streaming Support**: Real-time token streaming for text generation
- **Batch Processing**: Efficient batch embedding generation
- **OpenAI Compatibility**: Uses OpenAI-compatible request/response schema
- **Health Check**: `/health` endpoint for monitoring

## Examples

See the `examples/` directory for complete working examples:

### Text Generation
- `basic-chat.ts` - Simple chat completion
- `streaming-chat.ts` - Streaming text generation
- `multi-model-test.ts` - Test multiple models

### Embeddings
- `text-embedding.ts` - Single text embedding
- `batch-embedding.ts` - Batch embedding generation
- `semantic-search.ts` - Semantic search implementation

### Image Generation
- `text-to-image.ts` - Generate single image
- `multi-image.ts` - Generate multiple images

## Error Handling

The SDK includes typed error handling:

```typescript
import { OpenModelsError } from 'openmodels';

try {
  const response = await openmodels.chat(request);
} catch (error) {
  if (error instanceof OpenModelsError) {
    console.error('OpenModels error:', error.message);
    console.error('Status:', error.status);
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  ChatMessage 
} from 'openmodels';
```

## License

MIT

# openmodels
