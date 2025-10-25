interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    max_tokens?: number;
    temperature?: number;
    stream?: boolean;
    top_p?: number;
    stop?: string | string[];
    presence_penalty?: number;
    frequency_penalty?: number;
    gpuTier?: "budget" | "pro" | "enterprise";
    batching_enabled?: boolean;
    cache_policy?: string;
    quantization?: "int8" | "int4" | "float16";
}
interface ChatCompletionResponse {
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
interface StreamChunk {
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

interface OpenModelsConfig {
    /**
     * Your OpenModels API key (required)
     * Get your API key from https://tryscout.dev
     */
    apiKey?: string;
    hfToken?: string;
}

interface EmbeddingRequest {
    model: string;
    input: string | string[];
    encoding_format?: 'float' | 'base64';
    gpuTier?: "budget" | "pro" | "enterprise";
    batching_enabled?: boolean;
    cache_policy?: string;
    quantization?: "int8" | "int4" | "float16";
}
interface EmbeddingResponse {
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
interface EmbeddingUsage {
    prompt_tokens: number;
    total_tokens: number;
}

interface ImageRequest {
    model: string;
    prompt: string;
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    quality?: 'standard' | 'hd';
    n?: number;
    style?: 'vivid' | 'natural';
    gpuTier?: "budget" | "pro" | "enterprise";
    batching_enabled?: boolean;
    cache_policy?: string;
    quantization?: "int8" | "int4" | "float16";
}
interface ImageResponse {
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
interface ImageGenerationOptions {
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    quality?: 'standard' | 'hd';
    n?: number;
    style?: 'vivid' | 'natural';
}

interface AudioTranscribeRequest {
    model: string;
    input: string;
    language?: string;
    prompt?: string;
    gpuTier?: 'budget' | 'pro' | 'enterprise';
    batching_enabled?: boolean;
    cache_policy?: string;
    quantization?: 'int8' | 'int4' | 'float16';
}
interface AudioTranscribeResponse {
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
interface AudioSummarizeRequest {
    model: string;
    input: string;
    prompt?: string;
    language?: string;
    gpuTier?: 'budget' | 'pro' | 'enterprise';
    batching_enabled?: boolean;
    cache_policy?: string;
    quantization?: 'int8' | 'int4' | 'float16';
}
interface AudioSummarizeResponse {
    id: string;
    object: 'audio.summary';
    text: string;
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

interface ImageClassificationRequest {
    model: string;
    input: string;
    top_k?: number;
    gpuTier?: 'budget' | 'pro' | 'enterprise';
    batching_enabled?: boolean;
    cache_policy?: string;
    quantization?: 'int8' | 'int4' | 'float16';
}
interface ImageClassificationResponse {
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

type Task = 'text-generation' | 'image-generation' | 'embedding' | 'audio-transcribe' | 'audio-summarize' | 'image-classification';
type RunRequest = ({
    task: 'text-generation';
    model?: string;
} & Omit<ChatCompletionRequest, 'model'>) | ({
    task: 'image-generation';
    model?: string;
} & Omit<ImageRequest, 'model'>) | ({
    task: 'embedding';
    model?: string;
} & Omit<EmbeddingRequest, 'model'>) | ({
    task: 'audio-transcribe';
    model?: string;
} & Omit<AudioTranscribeRequest, 'model'>) | ({
    task: 'audio-summarize';
    model?: string;
} & Omit<AudioSummarizeRequest, 'model'>) | ({
    task: 'image-classification';
    model?: string;
} & Omit<ImageClassificationRequest, 'model'>);
type RunResponse = ChatCompletionResponse | ImageResponse | EmbeddingResponse | AudioTranscribeResponse | AudioSummarizeResponse | ImageClassificationResponse;
interface RunError {
    error: string;
    status?: number;
}

declare class OpenModels {
    private textProvider;
    private embedProvider;
    private imageProvider;
    private audioProvider;
    private visionProvider;
    constructor(config?: OpenModelsConfig);
    chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncGenerator<string, void, unknown>>;
    embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
    image(request: ImageRequest): Promise<ImageResponse>;
    run(request: RunRequest): Promise<RunResponse | AsyncGenerator<string, void, unknown>>;
}
declare function client(config?: OpenModelsConfig): OpenModels;

declare class OpenModelsError extends Error {
    status?: number | undefined;
    code?: string | undefined;
    constructor(message: string, status?: number | undefined, code?: string | undefined);
}
declare function parseSSEStream(response: any): AsyncGenerator<string, void, unknown>;

interface ModelCapabilities {
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
declare function getModelCapabilities(model: string, type: 'text' | 'image' | 'embed' | 'vision' | 'audio'): ModelCapabilities;

export { type AudioSummarizeRequest, type AudioSummarizeResponse, type AudioTranscribeRequest, type AudioTranscribeResponse, type ChatCompletionRequest, type ChatCompletionResponse, type ChatMessage, type EmbeddingRequest, type EmbeddingResponse, type EmbeddingUsage, type ImageClassificationRequest, type ImageClassificationResponse, type ImageGenerationOptions, type ImageRequest, type ImageResponse, type ModelCapabilities, OpenModels, type OpenModelsConfig, OpenModelsError, type RunError, type RunRequest, type RunResponse, type StreamChunk, type Task, client, getModelCapabilities, parseSSEStream };
