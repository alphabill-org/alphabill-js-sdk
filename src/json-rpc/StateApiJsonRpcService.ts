import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IStateApiService } from '../IStateApiService.js';
import { IUnit } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionPayload } from '../transaction/TransactionPayload.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { ITransactionProofFactory } from './ITransactionProofFactory.js';
import { IUnitDto } from './IUnitDto.js';
import { IUnitFactory } from './IUnitFactory.js';
import { JsonRpcClient } from './JsonRpcClient.js';
import { JsonRpcHttpService } from './JsonRpcHttpService.js';
import { TransactionProofFactory } from './TransactionProofFactory.js';

export type TransactionProofDto = { txRecord: string; txProof: string };

export class StateApiJsonRpcService implements IStateApiService {
  private readonly client: JsonRpcClient;

  public constructor(
    service: IJsonRpcService,
    private readonly unitFactory: IUnitFactory,
    private readonly transactionProofFactory: ITransactionProofFactory,
  ) {
    this.client = new JsonRpcClient(service);
  }

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
      identifiers.push(this.unitFactory.createUnitId(Base16Converter.decode(id)));
    }

    return identifiers;
  }

  public async getUnit(unitId: IUnitId, includeStateProof: boolean): Promise<IUnit<unknown> | null> {
    const response = await this.client.request<IUnitDto>(
      'state_getUnit',
      Base16Converter.encode(unitId.getBytes()),
      includeStateProof,
    );

    if (response) {
      return this.unitFactory.createUnit(response);
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

    return response ? this.transactionProofFactory.create(response) : null;
  }

  public async sendTransaction(transactionBytes: Uint8Array): Promise<Uint8Array> {
    const response = (await this.client.request(
      'state_sendTransaction',
      Base16Converter.encode(transactionBytes),
    )) as string;
    return Base16Converter.decode(response);
  }
}

export function http(url: string, unitFactory: IUnitFactory, cborCodec: ICborCodec): IStateApiService {
  return new StateApiJsonRpcService(
    new JsonRpcHttpService(url),
    unitFactory,
    new TransactionProofFactory(cborCodec, unitFactory),
  );
}
