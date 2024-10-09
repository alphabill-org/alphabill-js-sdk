import { ICborCodec } from './codec/cbor/ICborCodec.js';
import { IStateApiService } from './IStateApiService.js';
import { JsonRpcClient } from './json-rpc/JsonRpcClient';
import { JsonRpcClient } from './json-rpc/JsonRpcClient.js';
import { JsonRpcHttpService } from './json-rpc/JsonRpcHttpService.js';
import { StateApiClient } from './StateApiClient.js';
import { StateApiMoneyClient } from './StateApiMoneyClient.js';
import { StateApiTokenClient } from './StateApiTokenClient.js';
import { TokenUnitIdFactory } from './transaction/TokenUnitIdFactory.js';

type StateApiClientOptions = {
  transport: IStateApiService;
};

type StateApiMoneyClientOptions = StateApiClientOptions & {
  cborCodec: ICborCodec;
};

type StateApiTokenClientOptions = StateApiClientOptions & { tokenUnitIdFactory: TokenUnitIdFactory };

/**
 * Create public client.
 * @param {StateApiClientOptions} options Options.
 * @returns {StateApiClient} State API client.
 */
export function createPublicClient(options: StateApiClientOptions): StateApiClient {
  return new StateApiClient(options.transport);
}

/**
 * Create money partition client.
 * @param {StateApiMoneyClientOptions} options Options.
 * @returns {StateApiMoneyClient} State API client.
 */
export function createMoneyClient(options: StateApiMoneyClientOptions): StateApiMoneyClient {
  return new StateApiMoneyClient(options.transport, options.cborCodec);
}

/**
 * Create token partition client.
 * @param {StateApiTokenClientOptions} options Options.
 * @returns {StateApiTokenClient} State API client.
 */
export function createTokenClient(options: StateApiTokenClientOptions): StateApiTokenClient {
  return new StateApiTokenClient(options.tokenUnitIdFactory, options.transport);
}

/**
 * Create HTTP state API service.
 * @param {string} url URL.
 * @param {ICborCodec} cborCodec CBOR codec.
 * @returns {IStateApiService} State API service.
 */
export function http(url: string, cborCodec: ICborCodec): IStateApiService {
  return new JsonRpcClient(new JsonRpcClient(new JsonRpcHttpService(url)), cborCodec);
}
