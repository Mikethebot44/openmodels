import { HfInference } from '@huggingface/inference';
import {
  ChatCompletionRequest,
  EmbeddingRequest,
  ImageRequest,
  AudioTranscribeRequest,
  ImageClassificationRequest
} from '../types';

export class HuggingFaceProvider {
  private hf: HfInference;
  private apiKey: string;

  constructor(config: { apiKey: string; hfToken?: string }) {
    this.apiKey = config.apiKey;
    // Use HF token if provided, otherwise use the OpenModels API key
    const token = config.hfToken || process.env.HF_TOKEN;
    if (!token) {
      throw new Error('HuggingFace token is required');
    }
    this.hf = new HfInference(token);
  }

  async chat(request: ChatCompletionRequest): Promise<Response> {
    const response = await this.hf.chatCompletion({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.max_tokens,
      top_p: request.top_p,
      stop: request.stop,
      stream: request.stream || false,
    });

    // Convert HF response to OpenModels format
    return new Response(JSON.stringify({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      model: request.model,
      choices: [{
        message: {
          role: 'assistant',
          content: response.choices[0].message.content
        },
        finish_reason: response.choices[0].finish_reason
      }],
      usage: response.usage
    }));
  }

  async embed(request: EmbeddingRequest): Promise<Response> {
    const response = await this.hf.featureExtraction({
      model: request.model,
      inputs: Array.isArray(request.input) ? request.input : [request.input]
    });

    return new Response(JSON.stringify({
      object: 'list',
      data: Array.isArray(response[0]) ? response.map((embedding, i) => ({
        object: 'embedding',
        embedding: embedding,
        index: i
      })) : [{
        object: 'embedding',
        embedding: response,
        index: 0
      }],
      model: request.model
    }));
  }

  async image(request: ImageRequest): Promise<Response> {
    const response = await this.hf.textToImage({
      model: request.model,
      inputs: request.prompt,
      parameters: {
        width: parseInt(request.size?.split('x')[0] || '1024'),
        height: parseInt(request.size?.split('x')[1] || '1024'),
        num_inference_steps: request.quality === 'hd' ? 50 : 25
      }
    });

    // Convert blob to base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return new Response(JSON.stringify({
      data: [{
        b64_json: base64
      }]
    }));
  }

  async audioTranscribe(request: AudioTranscribeRequest): Promise<Response> {
    // Fetch audio file if URL provided
    const audioBlob = await fetch(request.input).then(r => r.blob());
    
    const response = await this.hf.automaticSpeechRecognition({
      model: request.model,
      data: audioBlob
    });

    return new Response(JSON.stringify({
      text: response.text
    }));
  }

  async audioSummarize(request: any): Promise<Response> {
    // First transcribe the audio
    const audioBlob = await fetch(request.input).then(r => r.blob());
    
    const transcription = await this.hf.automaticSpeechRecognition({
      model: request.model || 'openai/whisper-base',
      data: audioBlob
    });

    // Then summarize the text using a summarization model
    const summary = await this.hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: transcription.text,
      parameters: {
        max_length: 150,
        min_length: 30
      }
    });

    return new Response(JSON.stringify({
      text: summary.summary_text
    }));
  }

  async visionClassify(request: ImageClassificationRequest): Promise<Response> {
    // Fetch image if URL provided
    const imageBlob = await fetch(request.input).then(r => r.blob());
    
    const response = await this.hf.imageClassification({
      model: request.model,
      data: imageBlob
    });

    return new Response(JSON.stringify({
      classifications: response.map(r => ({
        label: r.label,
        score: r.score
      }))
    }));
  }
}

