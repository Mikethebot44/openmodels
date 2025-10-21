export interface AudioTranscribeRequest {
  model: string; // e.g., openai/whisper-base
  input: string; // file path or URL or base64
  language?: string;
  prompt?: string;
  gpuTier?: 'budget' | 'pro' | 'enterprise';
  batching_enabled?: boolean;
  cache_policy?: string;
  quantization?: 'int8' | 'int4' | 'float16';
}

export interface AudioTranscribeResponse {
  id: string;
  object: 'audio.transcription';
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language?: string;
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

export interface AudioSummarizeRequest {
  model: string; // summarization model
  input: string; // audio input (path/URL/base64)
  prompt?: string; // summary instruction
  language?: string;
  gpuTier?: 'budget' | 'pro' | 'enterprise';
  batching_enabled?: boolean;
  cache_policy?: string;
  quantization?: 'int8' | 'int4' | 'float16';
}

export interface AudioSummarizeResponse {
  id: string;
  object: 'audio.summary';
  text: string; // summarized text
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


