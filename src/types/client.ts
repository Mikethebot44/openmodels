export interface OpenModelsConfig {
  /**
   * Your OpenModels API key (required)
   * Get your API key from https://tryscout.dev
   */
  apiKey?: string;
  
  /**
   * @internal
   * Base URL for the service (for internal use only)
   * Service URLs are automatically determined based on operation type
   */
  baseUrl?: string;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl: string;
}

