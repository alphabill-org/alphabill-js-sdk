import { sha256 } from '@noble/hashes/sha256';
import { IUnitId } from '../IUnitId.js';
import { RootTrustBase } from '../RootTrustBase.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../transaction/order/TransactionOrder.js';
import { ITransactionOrderProof } from '../transaction/proofs/ITransactionOrderProof.js';
import { StateProof } from '../unit/StateProof.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { IRootTrustBaseDto } from './IRootTrustBaseDto.js';
import { IStateProofDto } from './IStateProofDto.js';
import { ITransactionProofDto } from './ITransactionProofDto.js';
import { JsonRpcError } from './JsonRpcError.js';

export type CreateUnit<T, U> = {
  create: (
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    data: U,
  ) => T;
};

export type CreateTransactionRecordWithProof<T> = {
  fromCbor: (rawData: Uint8Array) => T;
};

type GetUnitResponseDto<T> = {
  unitId: string;
  networkId: string;
  partitionId: string;
  data: T;
  stateProof: IStateProofDto;
};

/**
 * State API JSON-RPC service.
 */
export class JsonRpcClient {
  public constructor(private readonly service: IJsonRpcService) {}

  /**
   * Get round number.
   * @returns {Promise<bigint>} The round number.
   */
  public async getRoundNumber(): Promise<bigint> {
    return BigInt(await this.request('state_getRoundNumber'));
  }

  /**
   * Get Unit identifiers by owner ID.
   * @param {Uint8Array} ownerId Owner ID.
   * @returns {Promise<IUnitId[]>} Units identifiers.
   */
  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<readonly IUnitId[]> {
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

  /**
   * Get block.
   * @param {bigint} blockNumber Block number.
   * @returns {Promise<Uint8Array>} Block.
   */
  public async getBlock(blockNumber: bigint): Promise<Uint8Array> {
    const response = (await this.request('state_getBlock', String(blockNumber))) as string;
    return Base16Converter.decode(response);
  }

  /**
   * Get unit by ID.
   * @template T Unit type.
   * @param {IUnitId} unitId Unit ID.
   * @param {boolean} includeStateProof Include state proof.
   * @param {CreateUnit<T>} factory.
   * @returns {Promise<T | null>} Unit.
   */
  public async getUnit<T, U>(
    unitId: IUnitId,
    includeStateProof: boolean,
    factory: CreateUnit<T, U>,
  ): Promise<T | null> {
    const response = await this.request<GetUnitResponseDto<U>>(
      'state_getUnit',
      Base16Converter.encode(unitId.bytes),
      includeStateProof,
    );

    if (response) {
      return factory.create(
        UnitId.fromBytes(Base16Converter.decode(response.unitId)),
        Number(response.networkId),
        Number(response.partitionId),
        response.stateProof ? StateProof.create(response.stateProof) : null,
        response.data,
      );
    }

    return null;
  }

  /**
   * Get transaction proof.
   * @template TRP Transaction proof type.
   * @param {Uint8Array} transactionHash Transaction hash.
   * @param {CreateTransactionRecordWithProof<TRP>} transactionRecordWithProofFactory Transaction record with proof factory.
   * @returns {Promise<TRP | null} Transaction proof.
   */
  public async getTransactionProof<TRP>(
    transactionHash: Uint8Array,
    transactionRecordWithProofFactory: CreateTransactionRecordWithProof<TRP>,
  ): Promise<TRP | null> {
    const response = (await this.request(
      'state_getTransactionProof',
      Base16Converter.encode(transactionHash),
    )) as ITransactionProofDto | null;

    if (!response) {
      return null;
    }

    return transactionRecordWithProofFactory.fromCbor(Base16Converter.decode(response.txRecordProof));
  }

  /**
   * Send transaction.
   * @param {TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof | null>} transaction Transaction.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async sendTransaction(
    transaction: TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof | null>,
  ): Promise<Uint8Array> {
    const hex = Base16Converter.encode(transaction.encode());
    const response = (await this.request('state_sendTransaction', hex)) as string;
    return Base16Converter.decode(response);
  }

  /**
   * Get trust base.
   * @param {bigint} epochNumber Epoch number.
   * @returns {Promise<RootTrustBase>} Trust base.
   */
  public async getTrustBase(epochNumber: bigint): Promise<RootTrustBase> {
    const response = (await this.request('state_getTrustBase', String(epochNumber))) as IRootTrustBaseDto;
    return RootTrustBase.create(response);
  }

  /**
   * Wait for a transaction proof to be available.
   * @template TRP
   * @param {Uint8Array} transactionHash Transaction hash.
   * @param {CreateTransactionRecordWithProof<TRP>} transactionRecordWithProofFactory
   * @param {AbortSignal} signal Abort signal to abort action early.
   * @param {number} [interval=1000] Interval in milliseconds for polling.
   * @returns {Promise<TRP>} Transaction proof.
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
