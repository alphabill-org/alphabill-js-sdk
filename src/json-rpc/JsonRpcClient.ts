import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../transaction/order/TransactionOrder.js';
import { IPredicate } from '../transaction/predicate/IPredicate.js';
import { PredicateBytes } from '../transaction/predicate/PredicateBytes.js';
import { ITransactionOrderProof } from '../transaction/proof/ITransactionOrderProof.js';
import { TransactionRecordWithProofArray } from '../transaction/record/TransactionRecordWithProof.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { IUnitDto } from './IUnitDto.js';
import { JsonRpcError } from './JsonRpcError.js';
import { createStateProof } from './StateProofFactory.js';
import { TransactionProofDto } from './TransactionProofDto.js';

export type CreateUnit<T> = {
  create: (unitId: IUnitId, ownerPredicate: IPredicate, input: unknown, stateProof: IStateProof | null) => T;
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

  /**
   * @see {IStateApiService.getRoundNumber}
   */
  public async getRoundNumber(): Promise<bigint> {
    return BigInt(await this.request('state_getRoundNumber'));
  }

  /**
   * @see {IStateApiService.getUnitsByOwnerId}
   */
  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]> {
    const response = await this.request<string[] | null>('state_getUnitsByOwnerID', Base16Converter.encode(ownerId));

    const identifiers: IUnitId[] = [];
    for (const id of response ?? []) {
      identifiers.push(UnitId.fromBytes(Base16Converter.decode(id)));
    }

    return identifiers;
  }

  /**
   * @see {IStateApiService.getBlock}
   */
  public async getBlock(blockNumber: bigint): Promise<Uint8Array> {
    const response = (await this.request('state_getBlock', String(blockNumber))) as string;
    return Base16Converter.decode(response);
  }

  /**
   * @see {IStateApiService.getUnit}
   */
  public async getUnit<T>(unitId: IUnitId, includeStateProof: boolean, factory: CreateUnit<T>): Promise<T | null> {
    const response = await this.request<IUnitDto>(
      'state_getUnit',
      Base16Converter.encode(unitId.bytes),
      includeStateProof,
    );

    if (response) {
      const unitId = UnitId.fromBytes(Base16Converter.decode(response.unitId));

      return factory.create(
        unitId,
        new PredicateBytes(Base16Converter.decode(response.ownerPredicate)),
        response.data,
        response.stateProof ? createStateProof(response.stateProof) : null,
      );
    }

    return null;
  }

  /**
   * @see {IStateApiService.getTransactionProof}
   */
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
    return transactionRecordWithProofFactory.fromArray(transactionRecordWithProof, this.cborCodec);
  }

  /**
   * @see {IStateApiService.sendTransaction}
   */
  public async sendTransaction(
    transaction: TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof, ITransactionOrderProof>,
  ): Promise<Uint8Array> {
    const response = (await this.request(
      'state_sendTransaction',
      Base16Converter.encode(await this.cborCodec.encode(await transaction.encode(this.cborCodec))),
    )) as string;

    return Base16Converter.decode(response);
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
