import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { MoneyPartitionTransactionType } from '../../../json-rpc/MoneyPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import { UnlockBillAttributes, UnlockBillAttributesArray } from '../../attribute/UnlockBillAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
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
    authProof: OwnerProofAuthProof,
    feeProof: OwnerProofAuthProof,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
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
        MoneyPartitionTransactionType.UnlockBill,
        UnlockBillAttributes.fromArray(attributes as UnlockBillAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await OwnerProofAuthProof.decode(authProof, cborCodec),
      await OwnerProofAuthProof.decode(feeProof, cborCodec),
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
