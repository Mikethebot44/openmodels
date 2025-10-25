import { HuggingFaceProvider } from './providers/huggingface';
import { parseSSEStream, OpenModelsError } from './streaming';
import { 
  OpenModelsConfig, 
  ChatCompletionRequest, 
  ChatCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  ImageRequest,
  ImageResponse,
  AudioTranscribeRequest,
  AudioTranscribeResponse,
  AudioSummarizeRequest,
  AudioSummarizeResponse,
  ImageClassificationRequest,
  ImageClassificationResponse,
  RunRequest,
  RunResponse
} from './types';
import { getDefaultModel } from './registry';

export class OpenModels {
  private textProvider: HuggingFaceProvider;
  private embedProvider: HuggingFaceProvider;
  private imageProvider: HuggingFaceProvider;
  private audioProvider: HuggingFaceProvider;
  private visionProvider: HuggingFaceProvider;

  constructor(config: OpenModelsConfig = {}) {
    // Validate that API key is provided
    if (!config.apiKey) {
      throw new OpenModelsError('API key is required. Please provide an API key in the client configuration.');
    }

    // Validate API key format
    if (!config.apiKey.startsWith('om_') || config.apiKey.length < 10) {
      throw new OpenModelsError('Invalid API key format. API keys must start with "om_" and be at least 10 characters long.');
    }

    // Use HuggingFace Inference Providers
    const hfConfig = { 
      apiKey: config.apiKey,
      hfToken: config.hfToken 
    };
    
    this.textProvider = new HuggingFaceProvider(hfConfig);
    this.embedProvider = new HuggingFaceProvider(hfConfig);
    this.imageProvider = new HuggingFaceProvider(hfConfig);
    this.audioProvider = new HuggingFaceProvider(hfConfig);
    this.visionProvider = new HuggingFaceProvider(hfConfig);
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

  async run(request: RunRequest): Promise<RunResponse | AsyncGenerator<string, void, unknown>> {
    try {
      switch (request.task) {
        case 'text-generation': {
          const model = (request as any).model || getDefaultModel('text-generation');
          const chatReq: ChatCompletionRequest = { ...request, model } as any;
          const response = await this.textProvider.chat(chatReq);
          if (chatReq.stream) return parseSSEStream(response);
          return (await response.json()) as ChatCompletionResponse;
        }
        case 'image-generation': {
          const model = (request as any).model || getDefaultModel('image-generation');
          const imgReq: ImageRequest = { ...request, model } as any;
          const response = await this.imageProvider.image(imgReq);
          return (await response.json()) as ImageResponse;
        }
        case 'embedding': {
          const model = (request as any).model || getDefaultModel('embedding');
          const embReq: EmbeddingRequest = { ...request, model } as any;
          const response = await this.embedProvider.embed(embReq);
          return (await response.json()) as any;
        }
        case 'audio-transcribe': {
          const model = (request as any).model || getDefaultModel('audio-transcribe');
          const aReq: AudioTranscribeRequest = { ...request, model } as any;
          const response = await this.audioProvider.audioTranscribe!(aReq);
          return (await response.json()) as AudioTranscribeResponse;
        }
        case 'audio-summarize': {
          const model = (request as any).model || getDefaultModel('audio-summarize');
          const aReq: AudioSummarizeRequest = { ...request, model } as any;
          const response = await this.audioProvider.audioSummarize!(aReq);
          return (await response.json()) as AudioSummarizeResponse;
        }
        case 'image-classification': {
          const model = (request as any).model || getDefaultModel('image-classification');
          const vReq: ImageClassificationRequest = { ...request, model } as any;
          const response = await this.visionProvider.visionClassify!(vReq);
          return (await response.json()) as ImageClassificationResponse;
        }
        default:
          throw new OpenModelsError('Unsupported task');
      }
    } catch (error) {
      if (error instanceof Error) throw new OpenModelsError(error.message);
      throw new OpenModelsError('Unknown error occurred');
    }
  }
}

export function client(config?: OpenModelsConfig): OpenModels {
  return new OpenModels(config);
}

