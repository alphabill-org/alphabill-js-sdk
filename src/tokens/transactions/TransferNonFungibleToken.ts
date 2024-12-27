import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TypeOwnerProofsUnsignedTransactionOrder } from '../../transaction/unsigned/TypeOwnerProofsUnsignedTransactionOrder.js';
import { TransferNonFungibleTokenAttributes } from '../attributes/TransferNonFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type TransferNonFungibleTokenTransactionOrder = TransactionOrder<
  TransferNonFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
>;
interface ITransferNonFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  ownerPredicate: IPredicate;
  nonce: Uint8Array | null;
  counter: bigint;
  type: { unitId: IUnitId };
}

export class TransferNonFungibleToken {
  public static create(
    data: ITransferNonFungibleTokenTransactionData,
  ): TypeOwnerProofsUnsignedTransactionOrder<TransferNonFungibleTokenAttributes> {
    return new TypeOwnerProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.TransferNonFungibleToken,
        new TransferNonFungibleTokenAttributes(data.type.unitId, data.ownerPredicate, data.token.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<TransferNonFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, TransferNonFungibleTokenAttributes, TypeOwnerProofsAuthProof);
  }
}
