export interface ModelCapabilities {
  supportsTopP: boolean;
  supportsStop: boolean;
  supportsTemperature: boolean;
  supportsMaxTokens: boolean;
  supportsStreaming: boolean;
  supportsQuantization: boolean;
  supportedQuantizations?: ('int8' | 'int4' | 'float16')[];
  maxTokenLimit?: number;
  notes?: string;
}

export const TEXT_MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  "microsoft/DialoGPT-medium": {
    supportsTopP: true,
    supportsStop: true,
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsStreaming: true,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16'],
    maxTokenLimit: 1000,
    notes: "Conversational model, best for dialog"
  },
  "microsoft/DialoGPT-large": {
    supportsTopP: true,
    supportsStop: true,
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsStreaming: true,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16'],
    maxTokenLimit: 1000
  },
  "meta-llama/Llama-3.1-8B-Instruct": {
    supportsTopP: true,
    supportsStop: true,
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsStreaming: true,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'int4', 'float16'],
    maxTokenLimit: 4096,
    notes: "Instruction-following model"
  },
  "meta-llama/Meta-Llama-3-8B-Instruct": {
    supportsTopP: true,
    supportsStop: true,
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsStreaming: true,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'int4', 'float16'],
    maxTokenLimit: 4096,
    notes: "Instruction-following model with chat formatting"
  },
  "facebook/blenderbot-400M-distill": {
    supportsTopP: true,
    supportsStop: false,
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsStreaming: true,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16'],
    maxTokenLimit: 128
  },
  "EleutherAI/gpt-neo-2.7B": {
    supportsTopP: true,
    supportsStop: true,
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsStreaming: true,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'int4', 'float16'],
    maxTokenLimit: 2048
  }
};

export const IMAGE_MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  "runwayml/stable-diffusion-v1-5": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['float16'],
    notes: "Size, quality, style parameters supported"
  },
  "stabilityai/stable-diffusion-xl-base-1.0": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['float16'],
    notes: "Higher quality, slower generation"
  }
};

export const EMBED_MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  "sentence-transformers/all-MiniLM-L6-v2": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: false,
    notes: "Fast and efficient, good for most tasks"
  }
};

export const VISION_MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  "google/vit-base-patch16-224": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16'],
    notes: "Vision Transformer, good balance"
  },
  "facebook/convnext-base-224": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16']
  },
  "openai/clip-vit-base-patch32": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16']
  }
};

export const AUDIO_MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  "openai/whisper-base": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16'],
    notes: "Fast, good for most languages"
  },
  "openai/whisper-small": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16'],
    notes: "Better accuracy than base"
  },
  "openai/whisper-medium": {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: true,
    supportedQuantizations: ['int8', 'float16'],
    notes: "High accuracy, slower"
  }
};

export function getModelCapabilities(model: string, type: 'text' | 'image' | 'embed' | 'vision' | 'audio'): ModelCapabilities {
  const defaultCapabilities: ModelCapabilities = {
    supportsTopP: false,
    supportsStop: false,
    supportsTemperature: false,
    supportsMaxTokens: false,
    supportsStreaming: false,
    supportsQuantization: false
  };

  let registry: Record<string, ModelCapabilities>;
  switch (type) {
    case 'text': registry = TEXT_MODEL_CAPABILITIES; break;
    case 'image': registry = IMAGE_MODEL_CAPABILITIES; break;
    case 'embed': registry = EMBED_MODEL_CAPABILITIES; break;
    case 'vision': registry = VISION_MODEL_CAPABILITIES; break;
    case 'audio': registry = AUDIO_MODEL_CAPABILITIES; break;
    default: return defaultCapabilities;
  }

  return registry[model] || defaultCapabilities;
}

