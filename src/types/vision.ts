export interface ImageClassificationRequest {
  model: string; // e.g., google/vit-base-patch16-224
  input: string; // image URL or base64
  top_k?: number;
  gpuTier?: 'budget' | 'pro' | 'enterprise';
  batching_enabled?: boolean;
  cache_policy?: string;
  quantization?: 'int8' | 'int4' | 'float16';
}

export interface ImageClassificationResponse {
  id: string;
  object: 'image.classification';
  classifications: Array<{
    label: string;
    score: number;
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


