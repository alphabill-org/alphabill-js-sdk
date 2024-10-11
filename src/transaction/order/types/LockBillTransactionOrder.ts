import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { MoneyPartitionTransactionType } from '../../../json-rpc/MoneyPartitionTransactionType.js';
import { PredicateBytes } from '../../../PredicateBytes.js';
import { UnitId } from '../../../UnitId.js';
import { LockBillAttributes, LockBillAttributesArray } from '../../attribute/LockBillAttributes.js';
import { IPredicate } from '../../IPredicate.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class LockBillTransactionOrder extends TransactionOrder<
  LockBillAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<LockBillAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(MoneyPartitionTransactionType.LockBill, payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray(
    [
      networkIdentifier,
      systemIdentifier,
      unitId,
      ,
      attributes,
      stateLock,
      clientMetadata,
      stateUnlock,
      authProof,
      feeProof,
    ]: TransactionOrderArray,
    cborCodec: ICborCodec,
  ): Promise<LockBillTransactionOrder> {
    return new LockBillTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        LockBillAttributes.fromArray(attributes as LockBillAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
