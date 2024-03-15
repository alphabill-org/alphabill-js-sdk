import { IJsonRpcResponse } from './IJsonRpcResponse.js';

export interface IJsonRpcService {
  request(method: string, params: unknown | null): Promise<IJsonRpcResponse>;
}
