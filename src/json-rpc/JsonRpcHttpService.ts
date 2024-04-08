import { v4 as uuid } from 'uuid';
import { IJsonRpcResponse } from './IJsonRpcResponse.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { JsonRpcError } from './JsonRpcError.js';

/**
 * JSON-RPC HTTP service.
 */
export class JsonRpcHttpService implements IJsonRpcService {
  private readonly url: string;

  /**
   * JSON-RPC HTTP service constructor.
   */
  public constructor(url: string) {
    this.url = url;
  }

  /**
   * Send a JSON-RPC request.
   * @see {IJsonRpcService.request}
   */
  public async request(method: string, params: unknown | null): Promise<IJsonRpcResponse> {
    const response = await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: uuid(),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new JsonRpcError({
        code: 0,
        message: `Fetch failed: ${await response.text()}`,
      });
    }

    return response.json();
  }
}
