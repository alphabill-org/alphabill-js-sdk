import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../transaction/order/TransactionOrder.js';
import { ITransactionOrderProof } from '../transaction/proofs/ITransactionOrderProof.js';
import { TransactionRecordWithProofArray } from '../transaction/record/TransactionRecordWithProof.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { JsonRpcError } from './JsonRpcError.js';
import { TransactionProofDto } from './TransactionProofDto.js';

export type CreateUnit<T, U> = {
  create: (data: U) => T;
};

export type CreateTransactionRecordWithProof<T> = {
  // TODO: Rename fromArray
  fromArray: (transactionRecordWithProof: TransactionRecordWithProofArray, cborCodec: ICborCodec) => Promise<T>;
};

/**
 * State API JSON-RPC service.
 */
export class JsonRpcClient {
  public constructor(
    private readonly service: IJsonRpcService,
    public readonly cborCodec: ICborCodec,
  ) {}

  public async getRoundNumber(): Promise<bigint> {
    return BigInt(await this.request('state_getRoundNumber'));
  }

  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]> {
    const response = await this.request<string[] | null>(
      'state_getUnitsByOwnerID',
      Base16Converter.encode(sha256(ownerId)),
    );

    const identifiers: IUnitId[] = [];
    for (const id of response ?? []) {
      identifiers.push(UnitId.fromBytes(Base16Converter.decode(id)));
    }

    return identifiers;
  }

  public async getBlock(blockNumber: bigint): Promise<Uint8Array> {
    const response = (await this.request('state_getBlock', String(blockNumber))) as string;
    return Base16Converter.decode(response);
  }

  public async getUnit<T, U>(
    unitId: IUnitId,
    includeStateProof: boolean,
    factory: CreateUnit<T, U>,
  ): Promise<T | null> {
    const response = await this.request<U>('state_getUnit', Base16Converter.encode(unitId.bytes), includeStateProof);

    if (response) {
      try {
        return factory.create(response);
      } catch (error) {
        throw new Error(`Invalid unit for given factory: ${error}`);
      }
    }

    return null;
  }

  public async getTransactionProof<TRP>(
    transactionHash: Uint8Array,
    transactionRecordWithProofFactory: CreateTransactionRecordWithProof<TRP>,
  ): Promise<TRP | null> {
    const response = (await this.request(
      'state_getTransactionProof',
      Base16Converter.encode(transactionHash),
    )) as TransactionProofDto | null;

    if (!response) {
      return null;
    }

    const transactionRecordWithProof = (await this.cborCodec.decode(
      Base16Converter.decode(response.txRecordProof),
    )) as TransactionRecordWithProofArray;

    try {
      return transactionRecordWithProofFactory.fromArray(transactionRecordWithProof, this.cborCodec);
    } catch (error) {
      throw new Error(
        `Invalid transaction proof for given factory: ${JSON.stringify(transactionRecordWithProof)} [error: ${error}]`,
      );
    }
  }

  /**
   * @see {IStateApiService.sendTransaction}
   */
  public async sendTransaction(
    transaction: TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof>,
  ): Promise<Uint8Array> {
    const response = (await this.request(
      'state_sendTransaction',
      Base16Converter.encode(await this.cborCodec.encode(await transaction.encode(this.cborCodec))),
    )) as string;

    return Base16Converter.decode(response);
  }

  /**
   * Wait for a transaction proof to be available.
   * @param {Uint8Array} transactionHash Transaction hash.
   * @param {CreateTransactionRecordWithProof<TRP>} transactionRecordWithProofFactory
   * @param {AbortSignal} signal Abort signal to abort action early.
   * @param {number} [interval=1000] Interval in milliseconds for polling.
   * @returns {Promise<TransactionRecordWithProof>} Transaction proof.
   * @throws {string} Timeout.
   */
  public waitTransactionProof<TRP>(
    transactionHash: Uint8Array,
    transactionRecordWithProofFactory: CreateTransactionRecordWithProof<TRP>,
    signal: AbortSignal = AbortSignal.timeout(10000),
    interval = 1000,
  ): Promise<TRP> {
    return new Promise((resolve, reject) => {
      const abortListener = () => {
        signal.removeEventListener('abort', abortListener);
        reject(signal.reason);
      };

      signal.addEventListener('abort', abortListener);

      const fetchTransactionProof = () => {
        this.getTransactionProof(transactionHash, transactionRecordWithProofFactory).then((proof) => {
          if (proof !== null) {
            signal.removeEventListener('abort', abortListener);
            return resolve(proof);
          }

          setTimeout(fetchTransactionProof, interval);
        });
      };

      fetchTransactionProof();
    });
  }

  /**
   * Send a JSON-RPC request.
   * @see {IJsonRpcService.request}
   */
  protected async request<T>(method: string, ...params: unknown[]): Promise<T> {
    const response = await this.service.request(method, params || null);
    if (response.error) {
      throw new JsonRpcError(response.error);
    }

    return response.result as T;
  }
}
