import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { TransferBillAttributes } from '../attributes/TransferBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';

export class TransferBillTransactionOrder extends TransactionOrder<TransferBillAttributes, OwnerProofAuthProof> {
  public constructor(
    version: bigint,
    payload: TransactionPayload<TransferBillAttributes>,
    stateUnlock: IPredicate | null,
    authProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
  ) {
    super(version, payload, stateUnlock, authProof, feeProof);
  }

  public static fromCbor(rawData: Uint8Array): TransferBillTransactionOrder {
    const data = CborDecoder.readArray(rawData);
    return new TransferBillTransactionOrder(
      CborDecoder.readUnsignedInteger(data[0]),
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[1])),
        Number(CborDecoder.readUnsignedInteger(data[2])),
        UnitId.fromBytes(CborDecoder.readByteString(data[3])),
        MoneyPartitionTransactionType.TransferBill,
        TransferBillAttributes.fromCbor(data[5]),
        data[6] ? StateLock.fromCbor(data[6]) : null,
        ClientMetadata.fromCbor(data[7]),
      ),
      data[8] ? new PredicateBytes(CborDecoder.readByteString(data[8])) : null,
      OwnerProofAuthProof.fromCbor(data[9]),
      CborDecoder.readByteString(data[10]),
    );
  }
}
