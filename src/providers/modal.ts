import fetch from 'node-fetch';
import { BaseProvider } from './base';
import { ChatCompletionRequest, EmbeddingRequest, ImageRequest, AudioTranscribeRequest, AudioSummarizeRequest, ImageClassificationRequest } from '../types';
import { OpenModelsError } from '../streaming';

export class ModalProvider extends BaseProvider {
  async chat(request: ChatCompletionRequest): Promise<any> {
    const url = `${this.config.baseUrl}/chat`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 401) {
        throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
      }
      if (response.status === 403) {
        throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
      }
      
      throw new OpenModelsError(`Modal API error: ${response.status} ${errorText}`, response.status);
    }

    return response;
  }

  async embed(request: EmbeddingRequest): Promise<any> {
    const url = `${this.config.baseUrl}/embed`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 401) {
        throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
      }
      if (response.status === 403) {
        throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
      }
      
      throw new OpenModelsError(`Modal API error: ${response.status} ${errorText}`, response.status);
    }

    return response;
  }

  async image(request: ImageRequest): Promise<any> {
    const url = `${this.config.baseUrl}/image`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 401) {
        throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
      }
      if (response.status === 403) {
        throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
      }
      
      throw new OpenModelsError(`Modal API error: ${response.status} ${errorText}`, response.status);
    }

    return response;
  }

  async audioTranscribe(request: AudioTranscribeRequest): Promise<any> {
    const url = `${this.config.baseUrl}/transcribe`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(request) });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
      if (response.status === 403) throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
      throw new OpenModelsError(`Modal API error: ${response.status} ${errorText}`, response.status);
    }
    return response;
  }

  async audioSummarize(request: AudioSummarizeRequest): Promise<any> {
    const url = `${this.config.baseUrl}/summarize`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(request) });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
      if (response.status === 403) throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
      throw new OpenModelsError(`Modal API error: ${response.status} ${errorText}`, response.status);
    }
    return response;
  }

  async visionClassify(request: ImageClassificationRequest): Promise<any> {
    const url = `${this.config.baseUrl}/classify`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(request) });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
      if (response.status === 403) throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
      throw new OpenModelsError(`Modal API error: ${response.status} ${errorText}`, response.status);
    }
    return response;
  }
}
