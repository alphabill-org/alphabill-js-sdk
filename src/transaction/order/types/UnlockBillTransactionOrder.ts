import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { MoneyPartitionTransactionType } from '../../../json-rpc/MoneyPartitionTransactionType.js';
import { PredicateBytes } from '../../../PredicateBytes.js';
import { UnitId } from '../../../UnitId.js';
import { UnlockBillAttributes, UnlockBillAttributesArray } from '../../attribute/UnlockBillAttributes.js';
import { IPredicate } from '../../IPredicate.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class UnlockBillTransactionOrder extends TransactionOrder<
  UnlockBillAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<UnlockBillAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(MoneyPartitionTransactionType.UnlockBill, payload, authProof, feeProof, stateUnlock);
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
  ): Promise<UnlockBillTransactionOrder> {
    return new UnlockBillTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        UnlockBillAttributes.fromArray(attributes as UnlockBillAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
