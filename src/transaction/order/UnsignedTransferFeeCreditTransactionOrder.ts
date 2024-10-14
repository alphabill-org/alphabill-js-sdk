import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnitId } from '../../UnitId.js';
import { TransferFeeCreditAttributes } from '../attribute/TransferFeeCreditAttributes.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { UnitIdWithType } from '../UnitIdWithType.js';
import { UnitType } from '../UnitType.js';
import { TransferFeeCreditTransactionOrder } from './types/TransferFeeCreditTransactionOrder.js';

interface ITransferFeeCreditTransactionData {
  amount: bigint;
  targetSystemIdentifier: SystemIdentifier;
  latestAdditionTime: bigint;
  feeCreditRecord: {
    ownerPredicate: IPredicate;
    unitType: UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD | UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD;
    unitId?: IUnitId;
    counter?: bigint;
  };
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
  networkIdentifier: NetworkIdentifier;
  stateLock: StateLock | null;
  metadata: ITransactionClientMetadata;
  stateUnlock: IPredicate | null;
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
          data.targetSystemIdentifier,
          feeCreditRecordId,
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

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransferFeeCreditTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new TransferFeeCreditTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }

  private static createUnitId(timeout: bigint, ownerPredicate: IPredicate, unitType: UnitType): UnitId {
    const unitBytes = sha256.create().update(ownerPredicate.bytes).update(numberToBytesBE(timeout, 8)).digest();
    return new UnitIdWithType(unitBytes, unitType);
  }
}
