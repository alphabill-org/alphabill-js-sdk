import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofWithoutFeeUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofWithoutFeeUnsignedTransactionOrder.js';
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
  ): OwnerProofWithoutFeeUnsignedTransactionOrder<LockFeeCreditAttributes> {
    return new OwnerProofWithoutFeeUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<LockFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCredit.unitId,
        FeeCreditTransactionType.LockFeeCredit,
        new LockFeeCreditAttributes(data.status, data.feeCredit.counter),
        data.stateLock,
        data.metadata,
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
