import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofWithoutFeeTransactionOrder } from '../../transaction/OwnerProofWithoutFeeTransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitIdWithType } from '../../transaction/UnitIdWithType.js';
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
  ): OwnerProofWithoutFeeTransactionOrder<TransferFeeCreditAttributes> {
    let feeCreditRecordId = data.feeCreditRecord.unitId;
    if (feeCreditRecordId == null) {
      const unitBytes = sha256
        .create()
        .update(CborEncoder.encodeByteString(data.feeCreditRecord.ownerPredicate.bytes))
        .update(CborEncoder.encodeUnsignedInteger(data.latestAdditionTime))
        .digest();
      feeCreditRecordId = new UnitIdWithType(unitBytes, FeeCreditUnitType.FEE_CREDIT_RECORD);
    }
    return new OwnerProofWithoutFeeTransactionOrder(
      data.version,
      new TransactionPayload<TransferFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        FeeCreditTransactionType.TransferFeeCredit,
        new TransferFeeCreditAttributes(
          data.amount,
          data.targetPartitionIdentifier,
          feeCreditRecordId,
          data.latestAdditionTime,
          data.feeCreditRecord?.counter ?? 0n,
          data.bill.counter,
        ),
        data.stateLock,
        data.metadata,
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
