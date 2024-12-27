import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { UnitIdWithType } from '../../tokens/UnitIdWithType.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { FeelessOwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/FeelessOwnerProofUnsignedTransactionOrder.js';
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
  ): FeelessOwnerProofUnsignedTransactionOrder<SetFeeCreditAttributes> {
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
    return new FeelessOwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<SetFeeCreditAttributes>(
        data.networkIdentifier,
        data.targetPartitionIdentifier,
        feeCreditRecordId,
        FeeCreditTransactionType.SetFeeCredit,
        new SetFeeCreditAttributes(data.ownerPredicate, data.amount, data.feeCreditRecord.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
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
