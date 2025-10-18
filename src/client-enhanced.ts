import { ModalProvider } from './providers/modal';
import { parseSSEStream, OpenModelsError } from './streaming';
import { 
  OpenModelsConfig, 
  ChatCompletionRequest, 
  ChatCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  ImageRequest,
  ImageResponse
} from './types';

export class OpenModels {
  private textProvider: ModalProvider;
  private embedProvider: ModalProvider;
  private imageProvider: ModalProvider;

  constructor(config: OpenModelsConfig = {}) {
    // Determine base URLs for each service
    const baseUrl = config.baseUrl || 'https://tryscout.dev';
    
    // If baseUrl contains a subdomain or is a full Modal URL, use as-is
    // Otherwise, assume it's a base domain and add subdomains
    const getServiceUrl = (service: string) => {
      if (baseUrl.includes('modal.run') || baseUrl.includes('tryscout.dev')) {
        // If it's already a full URL or contains subdomain, use as-is
        return baseUrl;
      } else if (baseUrl.includes('.')) {
        // If it's a domain, add subdomain
        return `https://${service}.${baseUrl.replace('https://', '')}`;
      } else {
        // Default to tryscout.dev subdomains
        return `https://${service}.tryscout.dev`;
      }
    };

    this.textProvider = new ModalProvider({
      apiKey: config.apiKey,
      baseUrl: getServiceUrl('text'),
    });

    this.embedProvider = new ModalProvider({
      apiKey: config.apiKey,
      baseUrl: getServiceUrl('embed'),
    });

    this.imageProvider = new ModalProvider({
      apiKey: config.apiKey,
      baseUrl: getServiceUrl('image'),
    });
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncGenerator<string, void, unknown>> {
    try {
      const response = await this.textProvider.chat(request);
      
      if (request.stream) {
        return parseSSEStream(response);
      }
      
      const data = await response.json();
      return data as ChatCompletionResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new OpenModelsError(error.message);
      }
      throw new OpenModelsError('Unknown error occurred');
    }
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    try {
      const response = await this.embedProvider.embed(request);
      const data = await response.json();
      return data as EmbeddingResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new OpenModelsError(error.message);
      }
      throw new OpenModelsError('Unknown error occurred');
    }
  }

  async image(request: ImageRequest): Promise<ImageResponse> {
    try {
      const response = await this.imageProvider.image(request);
      const data = await response.json();
      return data as ImageResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new OpenModelsError(error.message);
      }
      throw new OpenModelsError('Unknown error occurred');
    }
  }
}

export function client(config?: OpenModelsConfig): OpenModels {
  return new OpenModels(config);
}
