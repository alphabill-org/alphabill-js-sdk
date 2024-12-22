import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofWithoutFeeUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofWithoutFeeUnsignedTransactionOrder.js';
import { UnlockFeeCreditAttributes } from '../attributes/UnlockFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export type UnlockFeeCreditTransactionOrder = TransactionOrder<UnlockFeeCreditAttributes, OwnerProofAuthProof>;
interface IUnlockFeeCreditTransactionData extends ITransactionData {
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnlockFeeCredit {
  public static create(
    data: IUnlockFeeCreditTransactionData,
  ): OwnerProofWithoutFeeUnsignedTransactionOrder<UnlockFeeCreditAttributes> {
    return new OwnerProofWithoutFeeUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<UnlockFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCredit.unitId,
        FeeCreditTransactionType.UnlockFeeCredit,
        new UnlockFeeCreditAttributes(data.feeCredit.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<UnlockFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, UnlockFeeCreditAttributes, OwnerProofAuthProof);
  }
}
