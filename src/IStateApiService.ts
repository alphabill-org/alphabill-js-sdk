import { IUnit } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { TransactionRecordWithProof } from './TransactionRecordWithProof.js';

export interface IStateApiService {
  getRoundNumber(): Promise<bigint>;
  getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]>;
  getUnit(unitId: IUnitId, includeStateProof: boolean): Promise<IUnit<unknown> | null>;
  getBlock(blockNumber: bigint): Promise<Uint8Array>;
  getTransactionProof(
    transactionHash: Uint8Array,
  ): Promise<TransactionRecordWithProof<TransactionPayload<ITransactionPayloadAttributes>> | null>;
  sendTransaction(transactionBytes: Uint8Array): Promise<Uint8Array>;
}
