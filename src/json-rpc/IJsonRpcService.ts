import { IJsonRpcResponse } from './IJsonRpcResponse.js';

/**
 * JSON-RPC service interface.
 * @interface IJsonRpcService
 */
export interface IJsonRpcService {
  /**
   * Send JSON-RPC request.
   * @param {string} method Method name.
   * @param {unknown | null} params Method parameters.
   * @returns {Promise<IJsonRpcResponse>} JSON-RPC response.
   * @throws {JsonRpcError} If request fails.
   */
  request(method: string, params: unknown | null): Promise<IJsonRpcResponse>;
}
