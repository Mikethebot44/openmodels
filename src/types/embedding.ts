export interface EmbeddingRequest {
  model: string;
  input: string | string[];
  encoding_format?: 'float' | 'base64';
  gpuTier?: "budget" | "pro" | "enterprise";
  batching_enabled?: boolean;
  cache_policy?: string;
  quantization?: "int8" | "int4" | "float16";
}

export interface EmbeddingResponse {
  object: 'list';
  data: Array<{
    object: 'embedding';
    index: number;
    embedding: number[];
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
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

export interface EmbeddingUsage {
  prompt_tokens: number;
  total_tokens: number;
}
