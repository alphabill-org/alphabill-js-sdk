import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofTransactionOrder } from '../../transaction/OwnerProofTransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { LockTokenAttributes } from '../attributes/LockTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type LockTokenTransactionOrder = TransactionOrder<LockTokenAttributes, OwnerProofAuthProof>;
export interface ILockTokenTransactionData extends ITransactionData {
  status: bigint;
  token: { unitId: IUnitId; counter: bigint };
}

export class LockToken {
  public static create(data: ILockTokenTransactionData): OwnerProofTransactionOrder<LockTokenAttributes> {
    return new OwnerProofTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.LockToken,
        new LockTokenAttributes(data.status, data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<LockTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, LockTokenAttributes, OwnerProofAuthProof);
  }
}
