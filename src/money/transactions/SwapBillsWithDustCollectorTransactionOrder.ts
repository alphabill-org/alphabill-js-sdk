import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { SwapBillsWithDustCollectorAttributes } from '../attributes/SwapBillsWithDustCollectorAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';

export class SwapBillsWithDustCollectorTransactionOrder extends TransactionOrder<
  SwapBillsWithDustCollectorAttributes,
  OwnerProofAuthProof
> {
  public constructor(
    version: bigint,
    payload: TransactionPayload<SwapBillsWithDustCollectorAttributes>,
    stateUnlock: IPredicate | null,
    authProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
  ) {
    super(version, payload, stateUnlock, authProof, feeProof);
  }

  public static fromCbor(rawData: Uint8Array): SwapBillsWithDustCollectorTransactionOrder {
    const data = CborDecoder.readArray(rawData);
    return new SwapBillsWithDustCollectorTransactionOrder(
      CborDecoder.readUnsignedInteger(data[0]),
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[1])),
        Number(CborDecoder.readUnsignedInteger(data[2])),
        UnitId.fromBytes(CborDecoder.readByteString(data[3])),
        MoneyPartitionTransactionType.SwapBillsWithDustCollector,
        SwapBillsWithDustCollectorAttributes.fromCbor(data[5]),
        data[6] ? StateLock.fromCbor(data[6]) : null,
        ClientMetadata.fromCbor(data[7]),
      ),
      data[8] ? new PredicateBytes(CborDecoder.readByteString(data[8])) : null,
      OwnerProofAuthProof.fromCbor(data[9]),
      CborDecoder.readByteString(data[10]),
    );
  }
}
