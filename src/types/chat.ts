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
  gpuTier?: "budget" | "pro" | "enterprise";
  batching_enabled?: boolean;
  cache_policy?: string;
  quantization?: "int8" | "int4" | "float16";
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
  cost_breakdown?: {
    gpu_seconds: number;
    gpu_hourly_rate: number;
    gpu_cost: number;
    storage_cost: number;
    bandwidth_cost: number;
    subtotal: number;
    margin: number;
    total_cost: number;
    estimated: boolean;
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

