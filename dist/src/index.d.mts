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
    apiKey?: string;
    baseUrl?: string;
}
interface ProviderConfig {
    apiKey?: string;
    baseUrl: string;
}

interface EmbeddingRequest {
    model: string;
    input: string | string[];
    encoding_format?: 'float' | 'base64';
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
}
interface ImageResponse {
    created: number;
    data: Array<{
        url?: string;
        b64_json?: string;
        revised_prompt?: string;
    }>;
}
interface ImageGenerationOptions {
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    quality?: 'standard' | 'hd';
    n?: number;
    style?: 'vivid' | 'natural';
}

declare class OpenModels {
    private textProvider;
    private embedProvider;
    private imageProvider;
    constructor(config?: OpenModelsConfig);
    chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncGenerator<string, void, unknown>>;
    embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
    image(request: ImageRequest): Promise<ImageResponse>;
}
declare function client(config?: OpenModelsConfig): OpenModels;

declare class OpenModelsError extends Error {
    status?: number | undefined;
    code?: string | undefined;
    constructor(message: string, status?: number | undefined, code?: string | undefined);
}
declare function parseSSEStream(response: any): AsyncGenerator<string, void, unknown>;

interface Provider {
    chat(request: any): Promise<any>;
    embed(request: any): Promise<any>;
    image(request: any): Promise<any>;
}
declare abstract class BaseProvider implements Provider {
    protected config: ProviderConfig;
    constructor(config: ProviderConfig);
    abstract chat(request: any): Promise<any>;
    abstract embed(request: any): Promise<any>;
    abstract image(request: any): Promise<any>;
}

declare class ModalProvider extends BaseProvider {
    chat(request: ChatCompletionRequest): Promise<any>;
    embed(request: EmbeddingRequest): Promise<any>;
    image(request: ImageRequest): Promise<any>;
}

export { type ChatCompletionRequest, type ChatCompletionResponse, type ChatMessage, type EmbeddingRequest, type EmbeddingResponse, type EmbeddingUsage, type ImageGenerationOptions, type ImageRequest, type ImageResponse, ModalProvider, OpenModels, type OpenModelsConfig, OpenModelsError, type ProviderConfig, type StreamChunk, client, parseSSEStream };
