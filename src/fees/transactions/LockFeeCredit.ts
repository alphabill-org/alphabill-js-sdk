import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { FeelessOwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/FeelessOwnerProofUnsignedTransactionOrder.js';
import { LockFeeCreditAttributes } from '../attributes/LockFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export type LockFeeCreditTransactionOrder = TransactionOrder<LockFeeCreditAttributes, OwnerProofAuthProof>;
interface ILockFeeCreditTransactionData extends ITransactionData {
  status: bigint;
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class LockFeeCredit {
  public static create(
    data: ILockFeeCreditTransactionData,
  ): FeelessOwnerProofUnsignedTransactionOrder<LockFeeCreditAttributes> {
    return new FeelessOwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<LockFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCredit.unitId,
        FeeCreditTransactionType.LockFeeCredit,
        new LockFeeCreditAttributes(data.status, data.feeCredit.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<LockFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, LockFeeCreditAttributes, OwnerProofAuthProof);
  }
}
