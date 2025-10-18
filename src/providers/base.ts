import { ProviderConfig } from '../types';

export interface Provider {
  chat(request: any): Promise<any>;
  embed(request: any): Promise<any>;
  image(request: any): Promise<any>;
}

export abstract class BaseProvider implements Provider {
  constructor(protected config: ProviderConfig) {}
  
  abstract chat(request: any): Promise<any>;
  abstract embed(request: any): Promise<any>;
  abstract image(request: any): Promise<any>;
}
