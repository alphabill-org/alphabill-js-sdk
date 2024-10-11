import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { FeeCreditTransactionType } from '../../../json-rpc/FeeCreditTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  ReclaimFeeCreditAttributes,
  ReclaimFeeCreditAttributesArray,
} from '../../attribute/ReclaimFeeCreditAttributes.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';
import { ClientMetadata } from '../../ClientMetadata.js';

export class ReclaimFeeCreditTransactionOrder extends TransactionOrder<
  ReclaimFeeCreditAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<ReclaimFeeCreditAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(FeeCreditTransactionType.ReclaimFeeCredit, payload, authProof, feeProof, stateUnlock);
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
        await ReclaimFeeCreditAttributes.fromArray(attributes as ReclaimFeeCreditAttributesArray, cborCodec),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
