import fetch from 'node-fetch';
import { BaseProvider } from './base';
import { ChatCompletionRequest, EmbeddingRequest, ImageRequest } from '../types';

export class ModalProvider extends BaseProvider {
  async chat(request: ChatCompletionRequest): Promise<any> {
    const url = `${this.config.baseUrl}/chat`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Modal API error: ${response.status} ${errorText}`);
    }

    return response;
  }

  async embed(request: EmbeddingRequest): Promise<any> {
    const url = `${this.config.baseUrl}/embed`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Modal API error: ${response.status} ${errorText}`);
    }

    return response;
  }

  async image(request: ImageRequest): Promise<any> {
    const url = `${this.config.baseUrl}/image`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Modal API error: ${response.status} ${errorText}`);
    }

    return response;
  }
}
