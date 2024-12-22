import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitIdWithType } from '../../transaction/UnitIdWithType.js';
import { OwnerProofWithoutFeeUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofWithoutFeeUnsignedTransactionOrder.js';
import { SetFeeCreditAttributes } from '../attributes/SetFeeCreditAttributes.js';
import { FeeCreditUnitType } from '../FeeCreditRecordUnitType.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export type SetFeeCreditTransactionOrder = TransactionOrder<SetFeeCreditAttributes, OwnerProofAuthProof>;
interface ISetFeeCreditTransactionData extends ITransactionData {
  targetPartitionIdentifier: number;
  ownerPredicate: IPredicate;
  amount: bigint;
  feeCreditRecord: { unitId: IUnitId | null; counter: bigint | null };
}

export class SetFeeCredit {
  public static create(
    data: ISetFeeCreditTransactionData,
  ): OwnerProofWithoutFeeUnsignedTransactionOrder<SetFeeCreditAttributes> {
    let feeCreditRecordId: IUnitId;
    if (data.feeCreditRecord.unitId == null) {
      const unitBytes = sha256
        .create()
        .update(CborEncoder.encodeByteString(data.ownerPredicate.bytes))
        .update(CborEncoder.encodeUnsignedInteger(data.metadata.timeout))
        .digest();
      feeCreditRecordId = new UnitIdWithType(unitBytes, FeeCreditUnitType.FEE_CREDIT_RECORD);
    } else {
      feeCreditRecordId = data.feeCreditRecord.unitId;
    }
    return new OwnerProofWithoutFeeUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<SetFeeCreditAttributes>(
        data.networkIdentifier,
        data.targetPartitionIdentifier,
        feeCreditRecordId,
        FeeCreditTransactionType.SetFeeCredit,
        new SetFeeCreditAttributes(data.ownerPredicate, data.amount, data.feeCreditRecord.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<SetFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, SetFeeCreditAttributes, OwnerProofAuthProof);
  }
}
