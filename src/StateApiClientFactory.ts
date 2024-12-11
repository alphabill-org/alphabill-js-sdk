import { JsonRpcClient } from './json-rpc/JsonRpcClient.js';
import { JsonRpcHttpService } from './json-rpc/JsonRpcHttpService.js';
import { MoneyPartitionJsonRpcClient } from './json-rpc/MoneyPartitionJsonRpcClient.js';
import { TokenPartitionJsonRpcClient } from './json-rpc/TokenPartitionJsonRpcClient.js';

type StateApiClientOptions = {
  transport: JsonRpcClient;
};

/**
 * Create money partition client.
 * @param {StateApiClientOptions} options Options.
 * @returns {MoneyPartitionJsonRpcClient} Money partition RPC client.
 */
export function createMoneyClient(options: StateApiClientOptions): MoneyPartitionJsonRpcClient {
  return new MoneyPartitionJsonRpcClient(options.transport);
}

/**
 * Create token partition client.
 * @param {StateApiClientOptions} options Options.
 * @returns {TokenPartitionJsonRpcClient} Token partition RPC client.
 */
export function createTokenClient(options: StateApiClientOptions): TokenPartitionJsonRpcClient {
  return new TokenPartitionJsonRpcClient(options.transport);
}

/**
 * Create HTTP state API service.
 * @param {string} url URL.
 * @returns {JsonRpcClient} State API service.
 */
export function http(url: string): JsonRpcClient {
  return new JsonRpcClient(new JsonRpcHttpService(url));
}
