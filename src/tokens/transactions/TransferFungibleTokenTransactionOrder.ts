import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { TransferFungibleTokenAttributes } from '../attributes/TransferFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class TransferFungibleTokenTransactionOrder extends TransactionOrder<
  TransferFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<TransferFungibleTokenAttributes>,
    authProof: TypeOwnerProofsAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromCbor(rawData: Uint8Array): Promise<TransferFungibleTokenTransactionOrder> {
    const data = CborDecoder.readArray(rawData);
    return new TransferFungibleTokenTransactionOrder(
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[0])),
        Number(CborDecoder.readUnsignedInteger(data[1])),
        UnitId.fromBytes(CborDecoder.readByteString(data[2])),
        TokenPartitionTransactionType.TransferFungibleToken,
        TransferFungibleTokenAttributes.fromCbor(data[4]),
        data[5] ? StateLock.fromCbor(data[5]) : null,
        ClientMetadata.fromCbor(data[6]),
      ),
      await TypeOwnerProofsAuthProof.fromCbor(data[7]),
      CborDecoder.readByteString(data[8]),
      data[9] ? new PredicateBytes(CborDecoder.readByteString(data[9])) : null,
    );
  }
}
