import { ChatCompletionRequest, ChatCompletionResponse, ChatMessage } from './chat';
import { EmbeddingRequest, EmbeddingResponse } from './embedding';
import { ImageRequest, ImageResponse } from './image';
import { AudioTranscribeRequest, AudioTranscribeResponse, AudioSummarizeRequest, AudioSummarizeResponse } from './audio';
import { ImageClassificationRequest, ImageClassificationResponse } from './vision';

export type Task =
  | 'text-generation'
  | 'image-generation'
  | 'embedding'
  | 'audio-transcribe'
  | 'audio-summarize'
  | 'image-classification';

export type RunRequest =
  | ({ task: 'text-generation'; model?: string } & Omit<ChatCompletionRequest, 'model'>)
  | ({ task: 'image-generation'; model?: string } & Omit<ImageRequest, 'model'>)
  | ({ task: 'embedding'; model?: string } & Omit<EmbeddingRequest, 'model'>)
  | ({ task: 'audio-transcribe'; model?: string } & Omit<AudioTranscribeRequest, 'model'>)
  | ({ task: 'audio-summarize'; model?: string } & Omit<AudioSummarizeRequest, 'model'>)
  | ({ task: 'image-classification'; model?: string } & Omit<ImageClassificationRequest, 'model'>);

export type RunResponse =
  | ChatCompletionResponse
  | ImageResponse
  | EmbeddingResponse
  | AudioTranscribeResponse
  | AudioSummarizeResponse
  | ImageClassificationResponse;

export interface RunError {
  error: string;
  status?: number;
}


