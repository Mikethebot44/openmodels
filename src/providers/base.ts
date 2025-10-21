import { ProviderConfig } from '../types';
import { AudioSummarizeRequest, AudioTranscribeRequest, ImageClassificationRequest } from '../types';

export interface Provider {
  chat(request: any): Promise<any>;
  embed(request: any): Promise<any>;
  image(request: any): Promise<any>;
  audioTranscribe?(request: AudioTranscribeRequest): Promise<any>;
  audioSummarize?(request: AudioSummarizeRequest): Promise<any>;
  visionClassify?(request: ImageClassificationRequest): Promise<any>;
}

export abstract class BaseProvider implements Provider {
  constructor(protected config: ProviderConfig) {}
  
  abstract chat(request: any): Promise<any>;
  abstract embed(request: any): Promise<any>;
  abstract image(request: any): Promise<any>;
  audioTranscribe?(request: AudioTranscribeRequest): Promise<any>;
  audioSummarize?(request: AudioSummarizeRequest): Promise<any>;
  visionClassify?(request: ImageClassificationRequest): Promise<any>;
}
