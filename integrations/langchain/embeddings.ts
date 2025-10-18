import { Embeddings } from '@langchain/core/embeddings';
import { client, OpenModelsConfig } from '../../src';

export interface OpenModelsEmbeddingParameters {
  model: string;
  encodingFormat?: 'float' | 'base64';
}

export class OpenModelsEmbeddings extends Embeddings {
  private openmodelsClient: any;
  private model: string;
  private encodingFormat: 'float' | 'base64';

  constructor(
    config: OpenModelsConfig,
    parameters: OpenModelsEmbeddingParameters
  ) {
    super();
    this.openmodelsClient = client(config);
    this.model = parameters.model;
    this.encodingFormat = parameters.encodingFormat ?? 'float';
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.openmodelsClient.embed({
        model: this.model,
        input: texts,
        encoding_format: this.encodingFormat
      });

      return response.data.map((item: any) => item.embedding);
    } catch (error) {
      throw new Error(`OpenModels embedding error: ${error}`);
    }
  }

  async embedQuery(text: string): Promise<number[]> {
    try {
      const response = await this.openmodelsClient.embed({
        model: this.model,
        input: text,
        encoding_format: this.encodingFormat
      });

      return response.data[0].embedding;
    } catch (error) {
      throw new Error(`OpenModels embedding error: ${error}`);
    }
  }
}
