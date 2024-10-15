import { MoneyPartitionTransactionType } from '../../../json-rpc/MoneyPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  SwapBillsWithDustCollectorAttributes,
  SwapBillsWithDustCollectorAttributesArray,
} from '../../attribute/SwapBillsWithDustCollectorAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof, OwnerProofAuthProofArray } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class SwapBillsWithDustCollectorTransactionOrder extends TransactionOrder<
  SwapBillsWithDustCollectorAttributes,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<SwapBillsWithDustCollectorAttributes>,
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
  ]: TransactionOrderArray): Promise<SwapBillsWithDustCollectorTransactionOrder> {
    return new SwapBillsWithDustCollectorTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        MoneyPartitionTransactionType.SwapBillsWithDustCollector,
        await SwapBillsWithDustCollectorAttributes.fromArray(attributes as SwapBillsWithDustCollectorAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await OwnerProofAuthProof.decode(authProof as OwnerProofAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
