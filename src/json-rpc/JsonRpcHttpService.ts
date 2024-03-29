import { v4 as uuid } from 'uuid';
import { IJsonRpcResponse } from './IJsonRpcResponse.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { JsonRpcError } from './JsonRpcError.js';

export class JsonRpcHttpService implements IJsonRpcService {
  private readonly url: string;

  public constructor(url: string) {
    this.url = url;
  }

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
