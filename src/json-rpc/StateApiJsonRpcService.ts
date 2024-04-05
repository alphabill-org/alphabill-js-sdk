import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IStateApiService } from '../IStateApiService.js';
import { IUnit } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../transaction/TransactionOrder.js';
import { TransactionPayload } from '../transaction/TransactionPayload.js';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IUnitDto } from './IUnitDto.js';
import { JsonRpcClient } from './JsonRpcClient.js';
import { JsonRpcHttpService } from './JsonRpcHttpService.js';
import { createUnit } from './UnitFactory.js';

export type TransactionProofDto = { txRecord: string; txProof: string };

export class StateApiJsonRpcService implements IStateApiService {
  public constructor(
    private readonly client: JsonRpcClient,
    private readonly cborCodec: ICborCodec,
  ) {}

  public async getRoundNumber(): Promise<bigint> {
    return BigInt(await this.client.request('state_getRoundNumber'));
  }

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

  public async getUnit<T>(unitId: IUnitId, includeStateProof: boolean): Promise<IUnit<T> | null> {
    const response = await this.client.request<IUnitDto>(
      'state_getUnit',
      Base16Converter.encode(unitId.getBytes()),
      includeStateProof,
    );

    if (response) {
      return createUnit(response);
    }

    return null;
  }

  public async getBlock(blockNumber: bigint): Promise<Uint8Array> {
    const response = (await this.client.request('state_getBlock', String(blockNumber))) as string;
    return Base16Converter.decode(response);
  }

  public async getTransactionProof(
    transactionHash: Uint8Array,
  ): Promise<TransactionRecordWithProof<TransactionPayload<ITransactionPayloadAttributes>> | null> {
    const response = (await this.client.request(
      'state_getTransactionProof',
      Base16Converter.encode(transactionHash),
    )) as TransactionProofDto | null;

    return response
      ? TransactionRecordWithProof.fromArray([
          (await this.cborCodec.decode(Base16Converter.decode(response.txRecord))) as TransactionRecordArray,
          (await this.cborCodec.decode(Base16Converter.decode(response.txProof))) as TransactionProofArray,
        ])
      : null;
  }

  public async sendTransaction(
    transaction: TransactionOrder<TransactionPayload<ITransactionPayloadAttributes>>,
  ): Promise<Uint8Array> {
    const response = (await this.client.request(
      'state_sendTransaction',
      Base16Converter.encode(await this.cborCodec.encode(transaction.toArray())),
    )) as string;
    return Base16Converter.decode(response);
  }
}

export function http(url: string, cborCodec: ICborCodec): IStateApiService {
  return new StateApiJsonRpcService(new JsonRpcClient(new JsonRpcHttpService(url)), cborCodec);
}
