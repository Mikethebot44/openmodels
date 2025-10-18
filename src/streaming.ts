import { StreamChunk } from './types';

export class OpenModelsError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'OpenModelsError';
  }
}

export async function* parseSSEStream(
  response: any
): AsyncGenerator<string, void, unknown> {
  if (!response.body) {
    throw new OpenModelsError('Response body is null');
  }

  // Handle authentication errors before parsing stream
  if (response.status === 401) {
    throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
  }
  if (response.status === 403) {
    throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
  }

  // Handle node-fetch response
  const text = await response.text();
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === '') continue;
    if (trimmed === '[DONE]') return;
    
    if (trimmed.startsWith('data: ')) {
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;
      
      try {
        const parsed: StreamChunk = JSON.parse(data);
        if (parsed.choices?.[0]?.delta?.content) {
          yield parsed.choices[0].delta.content;
        }
      } catch (e) {
        // Skip malformed JSON
        continue;
      }
    }
  }
}
