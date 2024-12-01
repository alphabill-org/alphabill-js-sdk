import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { UnlockBillAttributes } from '../attributes/UnlockBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';

export class UnlockBillTransactionOrder extends TransactionOrder<UnlockBillAttributes, OwnerProofAuthProof> {
  public constructor(
    version: bigint,
    payload: TransactionPayload<UnlockBillAttributes>,
    authProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(version, payload, authProof, feeProof, stateUnlock);
  }

  public static fromCbor(rawData: Uint8Array): UnlockBillTransactionOrder {
    const data = CborDecoder.readArray(rawData);
    return new UnlockBillTransactionOrder(
      CborDecoder.readUnsignedInteger(data[0]),
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[1])),
        Number(CborDecoder.readUnsignedInteger(data[2])),
        UnitId.fromBytes(CborDecoder.readByteString(data[3])),
        MoneyPartitionTransactionType.UnlockBill,
        UnlockBillAttributes.fromCbor(data[5]),
        data[6] ? StateLock.fromCbor(data[6]) : null,
        ClientMetadata.fromCbor(data[7]),
      ),
      OwnerProofAuthProof.fromCbor(data[8]),
      CborDecoder.readByteString(data[9]),
      data[10] ? new PredicateBytes(CborDecoder.readByteString(data[10])) : null,
    );
  }
}
