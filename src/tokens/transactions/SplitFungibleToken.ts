import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TypeOwnerProofsUnsignedTransactionOrder } from '../../transaction/unsigned/TypeOwnerProofsUnsignedTransactionOrder.js';
import { SplitFungibleTokenAttributes } from '../attributes/SplitFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type SplitFungibleTokenTransactionOrder = TransactionOrder<
  SplitFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
>;
interface ISplitFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  ownerPredicate: IPredicate;
  amount: bigint;
  type: { unitId: IUnitId };
}

export class SplitFungibleToken {
  public static create(
    data: ISplitFungibleTokenTransactionData,
  ): TypeOwnerProofsUnsignedTransactionOrder<SplitFungibleTokenAttributes> {
    return new TypeOwnerProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.SplitFungibleToken,
        new SplitFungibleTokenAttributes(data.type.unitId, data.amount, data.ownerPredicate, data.token.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<SplitFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, SplitFungibleTokenAttributes, TypeOwnerProofsAuthProof);
  }
}
