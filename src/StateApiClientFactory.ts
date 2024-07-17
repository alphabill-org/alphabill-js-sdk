import { ICborCodec } from './codec/cbor/ICborCodec.js';
import { IStateApiService } from './IStateApiService.js';
import { JsonRpcClient } from './json-rpc/JsonRpcClient.js';
import { JsonRpcHttpService } from './json-rpc/JsonRpcHttpService.js';
import { StateApiJsonRpcService } from './json-rpc/StateApiJsonRpcService.js';
import { StateApiClient } from './StateApiClient.js';
import { StateApiMoneyClient } from './StateApiMoneyClient.js';
import { StateApiTokenClient } from './StateApiTokenClient.js';
import { FeeCreditRecordUnitIdFactory } from './transaction/FeeCreditRecordUnitIdFactory.js';
import { ITransactionOrderFactory } from './transaction/ITransactionOrderFactory.js';
import { TokenUnitIdFactory } from './transaction/TokenUnitIdFactory.js';

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

type PlatformStateApiClientOptions = {
  transactionOrderFactory: ITransactionOrderFactory;
} & StateApiClientOptions;

/**
 * Create money partition client.
 * @param {PlatformStateApiClientOptions} options Options.
 * @returns {StateApiMoneyClient} State API client.
 */
export function createMoneyClient(
  options: PlatformStateApiClientOptions & { feeCreditRecordUnitIdFactory: FeeCreditRecordUnitIdFactory },
): StateApiMoneyClient {
  return new StateApiMoneyClient(
    options.transactionOrderFactory,
    options.feeCreditRecordUnitIdFactory,
    options.transport,
  );
}

/**
 * Create token partition client.
 * @param {PlatformStateApiClientOptions} options Options.
 * @returns {StateApiTokenClient} State API client.
 */
export function createTokenClient(
  options: PlatformStateApiClientOptions & { tokenUnitIdFactory: TokenUnitIdFactory },
): StateApiTokenClient {
  return new StateApiTokenClient(options.transactionOrderFactory, options.tokenUnitIdFactory, options.transport);
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
