import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { FeeCreditTransactionType } from '../../../json-rpc/FeeCreditTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import { CloseFeeCreditAttributes, CloseFeeCreditAttributesArray } from '../../attribute/CloseFeeCreditAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class CloseFeeCreditTransactionOrder extends TransactionOrder<
  CloseFeeCreditAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<CloseFeeCreditAttributes>,
    ownerProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, ownerProof, feeProof, stateUnlock);
  }

  public static async fromArray(
    [
      [networkIdentifier, systemIdentifier, unitId, , attributes, stateLock, clientMetadata],
      stateUnlock,
      authProof,
      feeProof,
    ]: TransactionOrderArray,
    cborCodec: ICborCodec,
  ): Promise<CloseFeeCreditTransactionOrder> {
    return new CloseFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        FeeCreditTransactionType.CloseFeeCredit,
        CloseFeeCreditAttributes.fromArray(attributes as CloseFeeCreditAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
