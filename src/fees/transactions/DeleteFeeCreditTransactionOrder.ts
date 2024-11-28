import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { DeleteFeeCreditAttributes } from '../attributes/DeleteFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export class DeleteFeeCreditTransactionOrder extends TransactionOrder<DeleteFeeCreditAttributes, OwnerProofAuthProof> {
  public constructor(
    payload: TransactionPayload<DeleteFeeCreditAttributes>,
    authProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromCbor(rawData: Uint8Array): Promise<DeleteFeeCreditTransactionOrder> {
    const data = CborDecoder.readArray(rawData);
    return new DeleteFeeCreditTransactionOrder(
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[0])),
        Number(CborDecoder.readUnsignedInteger(data[1])),
        UnitId.fromBytes(CborDecoder.readByteString(data[2])),
        FeeCreditTransactionType.DeleteFeeCredit,
        DeleteFeeCreditAttributes.fromCbor(data[4]),
        data[5] ? StateLock.fromCbor(data[5]) : null,
        ClientMetadata.fromCbor(data[6]),
      ),
      await OwnerProofAuthProof.fromCbor(data[7]),
      CborDecoder.readByteString(data[8]),
      data[9] ? new PredicateBytes(CborDecoder.readByteString(data[9])) : null,
    );
  }
}
