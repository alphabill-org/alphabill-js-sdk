import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofWithoutFeeTransactionOrder } from '../../transaction/OwnerProofWithoutFeeTransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { ReclaimFeeCreditAttributes } from '../attributes/ReclaimFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { CloseFeeCreditTransactionOrder } from './CloseFeeCredit.js';

export type ReclaimFeeCreditTransactionOrder = TransactionOrder<ReclaimFeeCreditAttributes, OwnerProofAuthProof>;
interface IReclaimFeeCreditTransactionData extends ITransactionData {
  proof: TransactionRecordWithProof<CloseFeeCreditTransactionOrder>;
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class ReclaimFeeCredit {
  public static create(
    data: IReclaimFeeCreditTransactionData,
  ): OwnerProofWithoutFeeTransactionOrder<ReclaimFeeCreditAttributes> {
    return new OwnerProofWithoutFeeTransactionOrder(
      data.version,
      new TransactionPayload<ReclaimFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        FeeCreditTransactionType.ReclaimFeeCredit,
        new ReclaimFeeCreditAttributes(data.proof),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<ReclaimFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, ReclaimFeeCreditAttributes, OwnerProofAuthProof);
  }
}
