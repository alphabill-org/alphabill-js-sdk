import { IJsonRpcService } from './IJsonRpcService.js';
import { JsonRpcError } from './JsonRpcError.js';

export class JsonRpcClient {
  private readonly service: IJsonRpcService;
  public constructor(service: IJsonRpcService) {
    this.service = service;
  }

  public async request<T>(method: string, ...params: unknown[]): Promise<T> {
    const response = await this.service.request(method, params || null);
    if (response.error) {
      throw new JsonRpcError(response.error);
    }

    return response.result as T;
  }
}
