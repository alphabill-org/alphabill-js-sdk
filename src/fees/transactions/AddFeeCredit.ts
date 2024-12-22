import { IUnitId } from '../../IUnitId.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofWithoutFeeTransactionOrder } from '../../transaction/OwnerProofWithoutFeeTransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { AddFeeCreditAttributes } from '../attributes/AddFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { TransferFeeCreditTransactionOrder } from './TransferFeeCredit.js';

export type AddFeeCreditTransactionOrder = TransactionOrder<AddFeeCreditAttributes, OwnerProofAuthProof>;
interface IAddFeeCreditTransactionData extends ITransactionData {
  targetPartitionIdentifier: number;
  ownerPredicate: IPredicate;
  proof: TransactionRecordWithProof<TransferFeeCreditTransactionOrder>;
  feeCreditRecord: { unitId: IUnitId };
}

export class AddFeeCredit {
  public static create(
    data: IAddFeeCreditTransactionData,
  ): OwnerProofWithoutFeeTransactionOrder<AddFeeCreditAttributes> {
    return new OwnerProofWithoutFeeTransactionOrder(
      data.version,
      new TransactionPayload<AddFeeCreditAttributes>(
        data.networkIdentifier,
        data.targetPartitionIdentifier,
        data.feeCreditRecord.unitId,
        FeeCreditTransactionType.AddFeeCredit,
        new AddFeeCreditAttributes(data.ownerPredicate, data.proof),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<AddFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, AddFeeCreditAttributes, OwnerProofAuthProof);
  }
}
