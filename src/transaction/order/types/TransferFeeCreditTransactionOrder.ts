import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { FeeCreditTransactionType } from '../../../json-rpc/FeeCreditTransactionType.js';
import { PredicateBytes } from '../../../PredicateBytes.js';
import { UnitId } from '../../../UnitId.js';
import {
  TransferFeeCreditAttributes,
  TransferFeeCreditAttributesArray,
} from '../../attribute/TransferFeeCreditAttributes.js';
import { IPredicate } from '../../IPredicate.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class TransferFeeCreditTransactionOrder extends TransactionOrder<
  TransferFeeCreditAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<TransferFeeCreditAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(FeeCreditTransactionType.TransferFeeCredit, payload, authProof, feeProof, stateUnlock);
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
  ): Promise<TransferFeeCreditTransactionOrder> {
    return new TransferFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        TransferFeeCreditAttributes.fromArray(attributes as TransferFeeCreditAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
