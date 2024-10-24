import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitIdWithType } from '../../transaction/UnitIdWithType.js';
import { SetFeeCreditAttributes } from '../attributes/SetFeeCreditAttributes.js';
import { FeeCreditUnitType } from '../FeeCreditRecordUnitType.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { SetFeeCreditTransactionOrder } from './SetFeeCreditTransactionOrder.js';

interface ISetFeeCreditTransactionData extends ITransactionData {
  targetSystemIdentifier: SystemIdentifier;
  ownerPredicate: IPredicate;
  amount: bigint;
  feeCreditRecord: { unitId: IUnitId | null; counter: bigint | null };
}

export class UnsignedSetFeeCreditTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<SetFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ISetFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedSetFeeCreditTransactionOrder> {
    let feeCreditRecordId: IUnitId;
    if (data.feeCreditRecord.unitId == null) {
      const unitBytes = sha256
        .create()
        .update(data.ownerPredicate.bytes)
        .update(numberToBytesBE(data.metadata.timeout, 8))
        .digest();
      feeCreditRecordId = new UnitIdWithType(unitBytes, FeeCreditUnitType.FEE_CREDIT_RECORD);
    } else {
      feeCreditRecordId = data.feeCreditRecord.unitId;
    }
    return Promise.resolve(
      new UnsignedSetFeeCreditTransactionOrder(
        new TransactionPayload<SetFeeCreditAttributes>(
          data.networkIdentifier,
          data.targetSystemIdentifier,
          feeCreditRecordId,
          FeeCreditTransactionType.SetFeeCredit,
          new SetFeeCreditAttributes(data.ownerPredicate, data.amount, data.feeCreditRecord.counter),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<SetFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new SetFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
