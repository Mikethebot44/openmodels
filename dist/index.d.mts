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

declare class OpenModels {
    private provider;
    constructor(config?: OpenModelsConfig);
    chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncGenerator<string, void, unknown>>;
}
declare function client(config?: OpenModelsConfig): OpenModels;

declare class OpenModelsError extends Error {
    status?: number | undefined;
    code?: string | undefined;
    constructor(message: string, status?: number | undefined, code?: string | undefined);
}
declare function parseSSEStream(response: Response): AsyncGenerator<string, void, unknown>;

interface Provider {
    chat(request: any): Promise<any>;
}
declare abstract class BaseProvider implements Provider {
    protected config: ProviderConfig;
    constructor(config: ProviderConfig);
    abstract chat(request: any): Promise<any>;
}

declare class ModalProvider extends BaseProvider {
    chat(request: ChatCompletionRequest): Promise<any>;
}

export { type ChatCompletionRequest, type ChatCompletionResponse, type ChatMessage, ModalProvider, OpenModels, type OpenModelsConfig, OpenModelsError, type ProviderConfig, type StreamChunk, client, parseSSEStream };
