# Migration Guide: Simplified Initialization

## What Changed?

Starting with version 0.4.0, the OpenModels client no longer requires you to provide Modal service URLs. The client now automatically determines the correct service URL based on the operation type (text, embed, image, audio, vision).

## Why This Change?

This change improves security and user experience:

1. **Security**: Users no longer have access to Modal URLs, preventing direct access to the backend services
2. **Simplicity**: Users only need to provide an API key
3. **Automatic Routing**: Service URLs are automatically selected based on the operation type

## Migration Steps

### Before (Old Method)

```typescript
import { client } from 'openmodels';

const openmodels = client({
  baseUrl: 'https://your-modal-app.modal.run',
  apiKey: 'om_your_api_key_here'
});
```

### After (New Method)

```typescript
import { client } from 'openmodels';

const openmodels = client({
  apiKey: 'om_your_api_key_here'
});
```

## Automatic Service URL Selection

The client automatically routes requests to the appropriate service:

- **Text Generation** (`chat()`) → Text service URL
- **Embeddings** (`embed()`) → Embed service URL  
- **Image Generation** (`image()`) → Image service URL
- **Audio** (transcribe/summarize) → Audio service URL
- **Vision** (classification) → Vision service URL

## Breaking Changes

### Removed Parameters

- `baseUrl` is no longer required in the client configuration
- The `baseUrl` parameter is now marked as `@internal` and should not be used

### Required Changes

1. Remove `baseUrl` from all client initializations
2. Ensure `apiKey` is provided (it's now the only required parameter)
3. Update any custom configurations that relied on `baseUrl`

## Framework Integrations

### LangChain

**Before:**
```typescript
const llm = new OpenModelsLLM(
  { baseUrl: 'https://your-modal-app.modal.run' },
  { model: 'microsoft/DialoGPT-medium' }
);
```

**After:**
```typescript
const llm = new OpenModelsLLM(
  { apiKey: 'om_your_api_key_here' },
  { model: 'microsoft/DialoGPT-medium' }
);
```

### LlamaIndex

**Before:**
```python
llm = OpenModelsLLM(
    base_url="https://your-modal-app.modal.run",
    model="microsoft/DialoGPT-medium"
)
```

**After:**
```python
llm = OpenModelsLLM(
    api_key="om_your_api_key_here",
    model="microsoft/DialoGPT-medium"
)
```

## FAQ

### Q: Can I still use custom service URLs?

A: The `baseUrl` parameter is now internal and should not be used. All service URLs are managed internally by the SDK.

### Q: What if I'm using a self-hosted version?

A: Self-hosted configurations will need to be handled through environment variables or internal configuration. Contact support for details on enterprise self-hosting options.

### Q: Will my existing code break?

A: If you're currently providing a `baseUrl`, you should remove it. The API key is now the only required parameter. Legacy code with `baseUrl` may still work but is deprecated.

### Q: How do I know which service URL is being used?

A: Service URLs are automatically selected and managed internally. You don't need to know or manage them directly.

## Need Help?

If you encounter issues during migration:

1. Check that you're using the latest version of the SDK
2. Ensure your API key is valid and starts with "om_"
3. Review the [updated README](./README.md) for current examples
4. Contact support at support@tryscout.dev

