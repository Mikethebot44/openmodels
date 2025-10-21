export interface ImageRequest {
  model: string;
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  n?: number; // number of images to generate
  style?: 'vivid' | 'natural';
  gpuTier?: "budget" | "pro" | "enterprise";
  batching_enabled?: boolean;
  cache_policy?: string;
  quantization?: "int8" | "int4" | "float16";
}

export interface ImageResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
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

export interface ImageGenerationOptions {
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  n?: number;
  style?: 'vivid' | 'natural';
}
