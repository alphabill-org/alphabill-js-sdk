import { IJsonRpcService } from './IJsonRpcService.js';
import { JsonRpcError } from './JsonRpcError.js';

/**
 * JSON-RPC client.
 */
export class JsonRpcClient {
  /**
   * Json RPC client constructor.
   * @param {IJsonRpcService} service JSON-RPC service.
   */
  public constructor(private readonly service: IJsonRpcService) {}

  /**
   * Send a JSON-RPC request.
   * @see {IJsonRpcService.request}
   */
  public async request<T>(method: string, ...params: unknown[]): Promise<T> {
    const response = await this.service.request(method, params || null);
    if (response.error) {
      throw new JsonRpcError(response.error);
    }

    return response.result as T;
  }
}
