import { IUnit } from './IUnit.js';
import { TransactionProof } from './TransactionProof.js';
import { IUnitId } from './IUnitId.js';

export interface IStateApiService {
  getRoundNumber(): Promise<bigint>;
  getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]>;
  getUnit(unitId: IUnitId, includeStateProof: boolean): Promise<IUnit<unknown> | null>;
  getBlock(blockNumber: bigint): Promise<Uint8Array>;
  getTransactionProof(transactionHash: Uint8Array): Promise<TransactionProof | null>;
  sendTransaction(transactionBytes: Uint8Array): Promise<Uint8Array>;
}
