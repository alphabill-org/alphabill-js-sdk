import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { FeeCreditTransactionType } from '../../../json-rpc/FeeCreditTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  ReclaimFeeCreditAttributes,
  ReclaimFeeCreditAttributesArray,
} from '../../attribute/ReclaimFeeCreditAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class ReclaimFeeCreditTransactionOrder extends TransactionOrder<
  ReclaimFeeCreditAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<ReclaimFeeCreditAttributes>,
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
  ): Promise<ReclaimFeeCreditTransactionOrder> {
    return new ReclaimFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        FeeCreditTransactionType.ReclaimFeeCredit,
        await ReclaimFeeCreditAttributes.fromArray(attributes as ReclaimFeeCreditAttributesArray, cborCodec),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await OwnerProofAuthProof.decode(authProof, cborCodec),
      await OwnerProofAuthProof.decode(feeProof, cborCodec),
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
