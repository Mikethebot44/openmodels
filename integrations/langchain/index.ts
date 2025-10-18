import { LLM, type LLMCallbackManager } from '@langchain/core/language_models/llms';
import { client, OpenModelsConfig } from '../../src';

export interface OpenModelsLLMParameters {
  model: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
}

export class OpenModelsLLM extends LLM {
  private openmodelsClient: any;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private streaming: boolean;

  constructor(
    config: OpenModelsConfig,
    parameters: OpenModelsLLMParameters,
    callbackManager?: LLMCallbackManager
  ) {
    super({ callbacks: callbackManager });
    this.openmodelsClient = client(config);
    this.model = parameters.model;
    this.temperature = parameters.temperature ?? 0.7;
    this.maxTokens = parameters.maxTokens ?? 200;
    this.streaming = parameters.streaming ?? false;
  }

  _llmType(): string {
    return 'openmodels';
  }

  async _call(
    prompt: string,
    stop?: string[],
    runManager?: any
  ): Promise<string> {
    try {
      const response = await this.openmodelsClient.chat({
        model: this.model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: false
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenModels API error: ${error}`);
    }
  }

  async _stream(
    prompt: string,
    stop?: string[],
    runManager?: any
  ): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const stream = await this.openmodelsClient.chat({
        model: this.model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: true
      }) as AsyncGenerator<string, void, unknown>;

      return stream;
    } catch (error) {
      throw new Error(`OpenModels API error: ${error}`);
    }
  }

  _identifyingParams(): Record<string, any> {
    return {
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
      streaming: this.streaming
    };
  }
}