"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUDIO_MODEL_CAPABILITIES = exports.VISION_MODEL_CAPABILITIES = exports.EMBED_MODEL_CAPABILITIES = exports.IMAGE_MODEL_CAPABILITIES = exports.TEXT_MODEL_CAPABILITIES = void 0;
exports.getModelCapabilities = getModelCapabilities;
exports.TEXT_MODEL_CAPABILITIES = {
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
exports.IMAGE_MODEL_CAPABILITIES = {
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
exports.EMBED_MODEL_CAPABILITIES = {
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
exports.VISION_MODEL_CAPABILITIES = {
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
exports.AUDIO_MODEL_CAPABILITIES = {
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
function getModelCapabilities(model, type) {
    var defaultCapabilities = {
        supportsTopP: false,
        supportsStop: false,
        supportsTemperature: false,
        supportsMaxTokens: false,
        supportsStreaming: false,
        supportsQuantization: false
    };
    var registry;
    switch (type) {
        case 'text':
            registry = exports.TEXT_MODEL_CAPABILITIES;
            break;
        case 'image':
            registry = exports.IMAGE_MODEL_CAPABILITIES;
            break;
        case 'embed':
            registry = exports.EMBED_MODEL_CAPABILITIES;
            break;
        case 'vision':
            registry = exports.VISION_MODEL_CAPABILITIES;
            break;
        case 'audio':
            registry = exports.AUDIO_MODEL_CAPABILITIES;
            break;
        default: return defaultCapabilities;
    }
    return registry[model] || defaultCapabilities;
}
