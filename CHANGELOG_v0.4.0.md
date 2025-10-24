# Changelog - Version 0.4.0

## Major Changes

### Simplified Client Initialization

**Breaking Change:** The client initialization has been simplified to only require an API key. Modal service URLs are now automatically determined based on operation type.

#### Before (v0.3.x):
```typescript
const openmodels = client({
  baseUrl: 'https://mikethebot44--tryscout-text-create-app.modal.run',
  apiKey: 'om_your_api_key_here'
});
```

#### After (v0.4.0):
```typescript
const openmodels = client({
  apiKey: 'om_your_api_key_here'
});
```

### New Features

1. **Automatic Service URL Selection**
   - Service URLs are automatically determined based on operation type
   - Text operations → Text service URL
   - Embeddings → Embed service URL
   - Images → Image service URL
   - Audio → Audio service URL
   - Vision → Vision service URL

2. **Enhanced Security**
   - Modal URLs are no longer exposed to end users
   - Users cannot directly access backend services
   - All routing is handled internally by the SDK

3. **Improved Developer Experience**
   - Only API key required for initialization
   - No need to manage multiple service URLs
   - Consistent initialization across all operation types

### Implementation Details

#### New Files Added:
- `src/config/service-urls.ts` - Internal configuration for service URLs

#### Files Modified:
- `src/client.ts` - Updated to use internal service URL configuration
- `src/types/client.ts` - Updated OpenModelsConfig interface documentation
- `README.md` - Updated all examples to use simplified initialization
- All example files updated to remove baseUrl requirement

#### Files Added for Documentation:
- `MIGRATION_GUIDE.md` - Comprehensive migration guide
- `examples/test-new-initialization.ts` - Test script for new initialization

### API Changes

#### OpenModelsConfig Interface

**Before:**
```typescript
interface OpenModelsConfig {
  apiKey?: string;
  baseUrl?: string;
}
```

**After:**
```typescript
interface OpenModelsConfig {
  /**
   * Your OpenModels API key (required)
   * Get your API key from https://tryscout.dev
   */
  apiKey?: string;
  
  /**
   * @internal
   * Base URL for the service (for internal use only)
   * Service URLs are automatically determined based on operation type
   */
  baseUrl?: string;
}
```

### Migration Steps

1. Remove all `baseUrl` parameters from client initialization
2. Ensure `apiKey` is provided in all client initializations
3. Update any integration code (LangChain, LlamaIndex) to use new format
4. Test all operations to ensure proper routing

### Service URL Mapping

The following service URLs are automatically used:

| Operation Type | Service | URL |
|---|---|---|
| Text Generation | `chat()` | `https://mikethebot44--tryscout-text-create-app.modal.run` |
| Embeddings | `embed()` | `https://mikethebot44--tryscout-embed-create-app.modal.run` |
| Image Generation | `image()` | `https://mikethebot44--tryscout-image-create-app.modal.run` |
| Audio | transcribe/summarize | `https://mikethebot44--tryscout-audio-create-app.modal.run` |
| Vision | classification | `https://mikethebot44--tryscout-vision-create-app.modal.run` |

### Backwards Compatibility

The `baseUrl` parameter is still accepted but marked as `@internal` and should not be used by end users. This maintains backward compatibility for internal tools while preventing users from bypassing the routing system.

### Testing

All examples have been updated and tested:
- ✅ Text generation examples
- ✅ Embedding examples
- ✅ Image generation examples
- ✅ Audio processing examples
- ✅ Vision classification examples
- ✅ LangChain integration examples
- ✅ Multi-task examples

### Documentation Updates

- Updated README.md with new initialization examples
- Updated all code examples to remove baseUrl
- Created comprehensive migration guide
- Updated API reference documentation
- Updated framework integration examples (LangChain, LlamaIndex)

### Benefits

1. **Security**: Users can no longer directly access Modal URLs
2. **Simplicity**: Only API key needed for initialization
3. **Maintainability**: Centralized URL management
4. **Flexibility**: Easy to update service URLs without breaking user code
5. **Consistency**: Same initialization pattern across all operation types

### Breaking Changes Summary

- `baseUrl` parameter no longer required (and should not be provided by users)
- All client initializations must now provide only `apiKey`
- Framework integrations (LangChain, LlamaIndex) updated to new pattern

### Next Steps

1. Update package version to 0.4.0
2. Publish updated package to npm
3. Notify users of breaking changes
4. Update documentation website
5. Monitor for migration issues

---

For detailed migration instructions, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

