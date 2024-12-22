import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { FeelessOwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/FeelessOwnerProofUnsignedTransactionOrder.js';
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
  ): FeelessOwnerProofUnsignedTransactionOrder<ReclaimFeeCreditAttributes> {
    return new FeelessOwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<ReclaimFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        FeeCreditTransactionType.ReclaimFeeCredit,
        new ReclaimFeeCreditAttributes(data.proof),
        data.stateLock,
        ClientMetadata.create(data.metadata),
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
