import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { FeelessOwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/FeelessOwnerProofUnsignedTransactionOrder.js';
import { CloseFeeCreditAttributes } from '../attributes/CloseFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export type CloseFeeCreditTransactionOrder = TransactionOrder<CloseFeeCreditAttributes, OwnerProofAuthProof>;
interface ICloseFeeCreditTransactionData extends ITransactionData {
  bill: { unitId: IUnitId; counter: bigint };
  feeCreditRecord: { unitId: IUnitId; balance: bigint; counter: bigint };
}

export class CloseFeeCredit {
  public static create(
    data: ICloseFeeCreditTransactionData,
  ): FeelessOwnerProofUnsignedTransactionOrder<CloseFeeCreditAttributes> {
    return new FeelessOwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<CloseFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCreditRecord.unitId,
        FeeCreditTransactionType.CloseFeeCredit,
        new CloseFeeCreditAttributes(
          data.feeCreditRecord.balance,
          data.bill.unitId,
          data.bill.counter,
          data.feeCreditRecord.counter,
        ),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<CloseFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, CloseFeeCreditAttributes, OwnerProofAuthProof);
  }
}
