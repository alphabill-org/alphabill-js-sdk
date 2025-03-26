import { IUnitId } from '../../IUnitId.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TypeOwnerProofsUnsignedTransactionOrder } from '../../transaction/unsigned/TypeOwnerProofsUnsignedTransactionOrder.js';
import { TransferFungibleTokenAttributes } from '../attributes/TransferFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type TransferFungibleTokenTransactionOrder = TransactionOrder<
  TransferFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
>;
interface ITransferFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint; typeId: IUnitId };
  ownerPredicate: IPredicate;
}

export class TransferFungibleToken {
  public static create(
    data: ITransferFungibleTokenTransactionData,
  ): TypeOwnerProofsUnsignedTransactionOrder<TransferFungibleTokenAttributes> {
    return new TypeOwnerProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.token.unitId,
        TokenPartitionTransactionType.TransferFungibleToken,
        new TransferFungibleTokenAttributes(
          data.token.typeId,
          data.token.value,
          data.ownerPredicate,
          data.token.counter,
        ),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<TransferFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, TransferFungibleTokenAttributes, TypeOwnerProofsAuthProof);
  }
}
