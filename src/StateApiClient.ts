import { sha256 } from '@noble/hashes/sha256';
import { IStateApiService } from './IStateApiService.js';
import { IUnit } from './IUnit.js';
import { TransactionOrder } from './transaction/TransactionOrder.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionProof } from './TransactionProof.js';
import { IUnitId } from './IUnitId.js';

export class StateApiClient {
  private readonly service: IStateApiService;

  public constructor(service: IStateApiService) {
    this.service = service;
  }

  public getRoundNumber(): Promise<bigint> {
    return this.service.getRoundNumber();
  }

  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]> {
    return this.service.getUnitsByOwnerId(sha256(ownerId));
  }

  public getUnit(unitId: IUnitId, includeStateProof: boolean): Promise<IUnit<unknown> | null> {
    return this.service.getUnit(unitId, includeStateProof);
  }

  public getBlock(blockNumber: bigint): Promise<Uint8Array> {
    return this.service.getBlock(blockNumber);
  }

  public async getTransactionProof(transactionHash: Uint8Array): Promise<TransactionProof | null> {
    return this.service.getTransactionProof(transactionHash);
  }

  public async sendTransaction<T extends TransactionPayload<ITransactionPayloadAttributes>>(
    transaction: TransactionOrder<T>,
  ): Promise<Uint8Array> {
    return this.service.sendTransaction(transaction.getBytes());
  }
}

export function createPublicClient(options: IStateApiClientOptions): StateApiClient {
  return new StateApiClient(options.transport);
}

interface IStateApiClientOptions {
  transport: IStateApiService;
}
