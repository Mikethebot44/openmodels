# OpenModels

SDK for calling open-source models with a consistent API, similar to OpenAI but focused on open-source models hosted on Modal or elsewhere.

## Installation

```bash
npm install openmodels
```

## Quick Start

### Basic Chat Completion

```typescript
import { client } from 'openmodels';

const openmodels = client({
  baseUrl: 'https://your-modal-app.modal.run', // Your deployed Modal URL
});

const response = await openmodels.chat({
  model: 'meta/llama-3-8b',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing in simple terms.' }
  ],
  max_tokens: 200,
  temperature: 0.7
});

console.log(response.choices[0].message.content);
```

### Streaming Chat

```typescript
import { client } from 'openmodels';

const openmodels = client({
  baseUrl: 'https://your-modal-app.modal.run',
});

const stream = await openmodels.chat({
  model: 'meta/llama-3-8b',
  messages: [
    { role: 'user', content: 'Write a short poem about AI.' }
  ],
  stream: true
}) as AsyncGenerator<string, void, unknown>;

for await (const token of stream) {
  process.stdout.write(token);
}
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

## Modal Backend Deployment

### Prerequisites

1. Install Modal CLI: `pip install modal`
2. Set up Modal account: `modal token new`

### Deploy the Backend

1. Navigate to the modal_backend directory:
   ```bash
   cd modal_backend
   ```

2. Deploy the text inference app:
   ```bash
   modal deploy text_inference.py
   ```

3. Note the deployed URL (e.g., `https://your-app-name.modal.run`)

4. Update your client configuration with the deployed URL:
   ```typescript
   const openmodels = client({
     baseUrl: 'https://your-app-name.modal.run',
   });
   ```

### Backend Features

- **Persistent Model Loading**: Uses Modal's `@app.cls` to avoid cold starts
- **GPU Acceleration**: Runs on A10G GPU for fast inference
- **Streaming Support**: Server-Sent Events (SSE) for real-time token streaming
- **OpenAI Compatibility**: Uses OpenAI-compatible request/response schema
- **Health Check**: `/health` endpoint for monitoring

## Examples

See the `examples/` directory for complete working examples:

- `basic-chat.ts`: Simple non-streaming chat completion
- `streaming-chat.ts`: Streaming chat with real-time token output

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
