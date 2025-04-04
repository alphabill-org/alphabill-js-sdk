import { IUnitId } from '../../IUnitId.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { FeelessOwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/FeelessOwnerProofUnsignedTransactionOrder.js';
import { DeleteFeeCreditAttributes } from '../attributes/DeleteFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export type DeleteFeeCreditTransactionOrder = TransactionOrder<DeleteFeeCreditAttributes, OwnerProofAuthProof>;
interface IDeleteFeeCreditTransactionData extends ITransactionData {
  feeCredit: { unitId: IUnitId; counter: bigint };
}

export class DeleteFeeCredit {
  public static create(
    data: IDeleteFeeCreditTransactionData,
  ): FeelessOwnerProofUnsignedTransactionOrder<DeleteFeeCreditAttributes> {
    return new FeelessOwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<DeleteFeeCreditAttributes>(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.feeCredit.unitId,
        FeeCreditTransactionType.DeleteFeeCredit,
        new DeleteFeeCreditAttributes(data.feeCredit.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
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
