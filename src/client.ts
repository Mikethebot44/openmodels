import { ModalProvider } from './providers/modal';
import { parseSSEStream, OpenModelsError } from './streaming';
import { 
  OpenModelsConfig, 
  ChatCompletionRequest, 
  ChatCompletionResponse 
} from './types';

export class OpenModels {
  private provider: ModalProvider;

  constructor(config: OpenModelsConfig = {}) {
    this.provider = new ModalProvider({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://modal.run/api/v1',
    });
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncGenerator<string, void, unknown>> {
    try {
      const response = await this.provider.chat(request);
      
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
}

export function client(config?: OpenModelsConfig): OpenModels {
  return new OpenModels(config);
}

