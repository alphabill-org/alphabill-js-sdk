import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
import { LockTokenAttributes } from '../attributes/LockTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type LockTokenTransactionOrder = TransactionOrder<LockTokenAttributes, OwnerProofAuthProof>;
export interface ILockTokenTransactionData extends ITransactionData {
  status: bigint;
  token: { unitId: IUnitId; counter: bigint };
}

export class LockToken {
  public static create(data: ILockTokenTransactionData): OwnerProofUnsignedTransactionOrder<LockTokenAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.LockToken,
        new LockTokenAttributes(data.status, data.token.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
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
