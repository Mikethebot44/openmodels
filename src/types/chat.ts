export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  model: string;
  choices: Array<{
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  object: 'chat.completion.chunk';
  model: string;
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string;
  }>;
}

