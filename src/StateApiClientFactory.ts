import { ICborCodec } from './codec/cbor/ICborCodec.js';
import { IStateApiService } from './IStateApiService.js';
import { JsonRpcClient } from './json-rpc/JsonRpcClient.js';
import { JsonRpcHttpService } from './json-rpc/JsonRpcHttpService.js';
import { StateApiJsonRpcService } from './json-rpc/StateApiJsonRpcService.js';
import { StateApiClient } from './StateApiClient.js';

type StateApiClientOptions = {
  transport: IStateApiService;
};

/**
 * Create public client.
 * @param {StateApiClientOptions} options Options.
 * @returns {StateApiClient} State API client.
 */
export function createPublicClient(options: StateApiClientOptions): StateApiClient {
  return new StateApiClient(options.transport);
}

/**
 * Create HTTP state API service.
 * @param {string} url URL.
 * @param {ICborCodec} cborCodec CBOR codec.
 * @returns {IStateApiService} State API service.
 */
export function http(url: string, cborCodec: ICborCodec): IStateApiService {
  return new StateApiJsonRpcService(new JsonRpcClient(new JsonRpcHttpService(url)), cborCodec);
}
