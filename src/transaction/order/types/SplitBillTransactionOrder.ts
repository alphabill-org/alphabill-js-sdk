import { MoneyPartitionTransactionType } from '../../../json-rpc/MoneyPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import { SplitBillAttributes, SplitBillAttributesArray } from '../../attribute/SplitBillAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof, OwnerProofAuthProofArray } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class SplitBillTransactionOrder extends TransactionOrder<SplitBillAttributes, OwnerProofAuthProof> {
  public constructor(
    payload: TransactionPayload<SplitBillAttributes>,
    authProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray([
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
  ]: TransactionOrderArray): Promise<SplitBillTransactionOrder> {
    return new SplitBillTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        MoneyPartitionTransactionType.SplitBill,
        SplitBillAttributes.fromArray(attributes as SplitBillAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await OwnerProofAuthProof.decode(authProof as OwnerProofAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
