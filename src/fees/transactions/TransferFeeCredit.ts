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
import { TransferFeeCreditAttributes } from '../attributes/TransferFeeCreditAttributes.js';
import { FeeCreditUnitType } from '../FeeCreditRecordUnitType.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export type TransferFeeCreditTransactionOrder = TransactionOrder<TransferFeeCreditAttributes, OwnerProofAuthProof>;
interface ITransferFeeCreditTransactionData extends ITransactionData {
  amount: bigint;
  targetPartitionIdentifier: number;
  latestAdditionTime: bigint;
  feeCreditRecord: {
    ownerPredicate: IPredicate;
    unitId?: IUnitId;
    counter?: bigint;
  };
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class TransferFeeCredit {
  public static create(
    data: ITransferFeeCreditTransactionData,
  ): FeelessOwnerProofUnsignedTransactionOrder<TransferFeeCreditAttributes> {
    let feeCreditRecordId = data.feeCreditRecord.unitId;
    if (feeCreditRecordId == null) {
      const unitBytes = sha256
        .create()
        .update(CborEncoder.encodeByteString(data.feeCreditRecord.ownerPredicate.bytes))
        .update(CborEncoder.encodeUnsignedInteger(data.latestAdditionTime))
        .digest();
      feeCreditRecordId = new UnitIdWithType(unitBytes, FeeCreditUnitType.FEE_CREDIT_RECORD);
    }
    return new FeelessOwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<TransferFeeCreditAttributes>(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.bill.unitId,
        FeeCreditTransactionType.TransferFeeCredit,
        new TransferFeeCreditAttributes(
          data.amount,
          data.targetPartitionIdentifier,
          feeCreditRecordId,
          data.latestAdditionTime,
          data.feeCreditRecord?.counter ?? null,
          data.bill.counter,
        ),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<TransferFeeCreditTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, TransferFeeCreditAttributes, OwnerProofAuthProof);
  }
}
