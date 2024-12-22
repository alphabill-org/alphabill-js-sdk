import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofWithoutFeeUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofWithoutFeeUnsignedTransactionOrder.js';
import { DeleteFeeCreditAttributes } from '../attributes/DeleteFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export type DeleteFeeCreditTransactionOrder = TransactionOrder<DeleteFeeCreditAttributes, OwnerProofAuthProof>;
interface IDeleteFeeCreditTransactionData extends ITransactionData {
  feeCredit: { unitId: IUnitId; counter: bigint };
}

export class DeleteFeeCredit {
  public static create(
    data: IDeleteFeeCreditTransactionData,
  ): OwnerProofWithoutFeeUnsignedTransactionOrder<DeleteFeeCreditAttributes> {
    return new OwnerProofWithoutFeeUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<DeleteFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.feeCredit.unitId,
        FeeCreditTransactionType.DeleteFeeCredit,
        new DeleteFeeCreditAttributes(data.feeCredit.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<DeleteFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, DeleteFeeCreditAttributes, OwnerProofAuthProof);
  }
}
