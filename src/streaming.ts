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
