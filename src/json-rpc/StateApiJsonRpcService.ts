import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IStateApiService } from '../IStateApiService.js';
import { IUnit } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../transaction/order/TransactionOrder.js';
import { TransactionOrderSerializerProvider } from '../transaction/serializer/TransactionOrderSerializerProvider.js';
import { TransactionRecordWithProofSerializer } from '../transaction/serializer/TransactionRecordWithProofSerializer.js';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IUnitDto } from './IUnitDto.js';
import { JsonRpcClient } from './JsonRpcClient.js';
import { createUnit } from './UnitFactory.js';

export type TransactionProofDto = { txRecord: string; txProof: string };

/**
 * State API JSON-RPC service.
 * @implements {IStateApiService}
 */
export class StateApiJsonRpcService implements IStateApiService {
  private readonly transactionOrderSerializerProvider: TransactionOrderSerializerProvider;

  public constructor(
    private readonly client: JsonRpcClient,
    public readonly cborCodec: ICborCodec,
  ) {
    this.transactionOrderSerializerProvider = new TransactionOrderSerializerProvider(cborCodec);
  }

  /**
   * @see {IStateApiService.getRoundNumber}
   */
  public async getRoundNumber(): Promise<bigint> {
    return BigInt(await this.client.request('state_getRoundNumber'));
  }

  /**
   * @see {IStateApiService.getUnitsByOwnerId}
   */
  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]> {
    const response = await this.client.request<string[] | null>(
      'state_getUnitsByOwnerID',
      Base16Converter.encode(ownerId),
    );

    const identifiers: IUnitId[] = [];
    for (const id of response ?? []) {
      identifiers.push(UnitId.fromBytes(Base16Converter.decode(id)));
    }

    return identifiers;
  }

  /**
   * @see {IStateApiService.getUnit}
   */
  public async getUnit<T extends IUnit>(unitId: IUnitId, includeStateProof: boolean): Promise<T | null> {
    const response = await this.client.request<IUnitDto>(
      'state_getUnit',
      Base16Converter.encode(unitId.bytes),
      includeStateProof,
    );

    if (response) {
      return createUnit<T>(response);
    }

    return null;
  }

  /**
   * @see {IStateApiService.getBlock}
   */
  public async getBlock(blockNumber: bigint): Promise<Uint8Array> {
    const response = (await this.client.request('state_getBlock', String(blockNumber))) as string;
    return Base16Converter.decode(response);
  }

  /**
   * @see {IStateApiService.getTransactionProof}
   */
  public async getTransactionProof<Attributes extends ITransactionPayloadAttributes, Proof>(
    transactionHash: Uint8Array,
  ): Promise<TransactionRecordWithProof<Attributes, Proof> | null> {
    const response = (await this.client.request(
      'state_getTransactionProof',
      Base16Converter.encode(transactionHash),
    )) as TransactionProofDto | null;

    if (!response) {
      return null;
    }

    const transactionRecord = (await this.cborCodec.decode(
      Base16Converter.decode(response.txRecord),
    )) as TransactionRecordArray;
    const transactionProof = (await this.cborCodec.decode(
      Base16Converter.decode(response.txProof),
    )) as TransactionProofArray;
    const type = transactionRecord[0][3];
    const serializer = this.transactionOrderSerializerProvider.getSerializer<Attributes, Proof>(type);
    if (!serializer) {
      throw new Error(`Could not find serializer for unknown transaction order ${type}.`);
    }

    return TransactionRecordWithProofSerializer.fromArray([transactionRecord, transactionProof], serializer);
  }

  /**
   * @see {IStateApiService.sendTransaction}
   */
  public async sendTransaction(
    transaction: TransactionOrder<ITransactionPayloadAttributes, unknown>,
  ): Promise<Uint8Array> {
    const serializer = this.transactionOrderSerializerProvider.getSerializer(transaction.type);
    if (!serializer) {
      throw new Error(`Could not find serializer for unknown transaction order ${transaction.type}.`);
    }

    const response = (await this.client.request(
      'state_sendTransaction',
      Base16Converter.encode(await serializer.serialize(transaction)),
    )) as string;

    return Base16Converter.decode(response);
  }
}
