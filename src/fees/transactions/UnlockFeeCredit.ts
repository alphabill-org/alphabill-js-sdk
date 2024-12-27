import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { FeelessOwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/FeelessOwnerProofUnsignedTransactionOrder.js';
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
  ): FeelessOwnerProofUnsignedTransactionOrder<UnlockFeeCreditAttributes> {
    return new FeelessOwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<UnlockFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCredit.unitId,
        FeeCreditTransactionType.UnlockFeeCredit,
        new UnlockFeeCreditAttributes(data.feeCredit.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
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
