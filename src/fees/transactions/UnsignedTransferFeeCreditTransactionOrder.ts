import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionUnitType } from '../../money/MoneyPartitionUnitType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TokenPartitionUnitType } from '../../tokens/TokenPartitionUnitType.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitIdWithType } from '../../transaction/UnitIdWithType.js';
import { UnitId } from '../../UnitId.js';
import { TransferFeeCreditAttributes } from '../attributes/TransferFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { TransferFeeCreditTransactionOrder } from './TransferFeeCreditTransactionOrder.js';

interface ITransferFeeCreditTransactionData extends ITransactionData {
  amount: bigint;
  targetSystemIdentifier: SystemIdentifier;
  latestAdditionTime: bigint;
  feeCreditRecord: {
    ownerPredicate: IPredicate;
    unitType: MoneyPartitionUnitType.FEE_CREDIT_RECORD | TokenPartitionUnitType.FEE_CREDIT_RECORD;
    unitId?: IUnitId;
    counter?: bigint;
  };
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedTransferFeeCreditTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<TransferFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ITransferFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedTransferFeeCreditTransactionOrder> {
    let feeCreditRecordId = data.feeCreditRecord.unitId;
    if (feeCreditRecordId == null) {
      feeCreditRecordId = this.createUnitId(
        data.metadata.timeout,
        data.feeCreditRecord.ownerPredicate,
        data.feeCreditRecord.unitType,
      );
    }
    return Promise.resolve(
      new UnsignedTransferFeeCreditTransactionOrder(
        new TransactionPayload<TransferFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          FeeCreditTransactionType.TransferFeeCredit,
          new TransferFeeCreditAttributes(
            data.amount,
            data.targetSystemIdentifier,
            feeCreditRecordId,
            data.latestAdditionTime,
            data.feeCreditRecord?.counter ?? 0n,
            data.bill.counter,
          ),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  private static createUnitId(timeout: bigint, ownerPredicate: IPredicate, unitType: number): UnitId {
    const unitBytes = sha256.create().update(ownerPredicate.bytes).update(numberToBytesBE(timeout, 8)).digest();
    return new UnitIdWithType(unitBytes, unitType);
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<TransferFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new TransferFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
