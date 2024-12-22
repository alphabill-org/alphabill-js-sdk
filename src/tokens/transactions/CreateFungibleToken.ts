import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
import { CreateFungibleTokenAttributes } from '../attributes/CreateFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TokenUnitId } from '../TokenUnitId.js';

export type CreateFungibleTokenTransactionOrder = TransactionOrder<CreateFungibleTokenAttributes, OwnerProofAuthProof>;
interface ICreateFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  value: bigint;
  nonce: bigint;
}

export class CreateFungibleToken {
  public static create(
    data: ICreateFungibleTokenTransactionData,
  ): OwnerProofUnsignedTransactionOrder<CreateFungibleTokenAttributes> {
    const attributes = new CreateFungibleTokenAttributes(data.type.unitId, data.value, data.ownerPredicate, data.nonce);
    const tokenUnitId = TokenUnitId.create(attributes, data.metadata, TokenPartitionUnitType.FUNGIBLE_TOKEN);
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        tokenUnitId,
        TokenPartitionTransactionType.CreateFungibleToken,
        attributes,
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<CreateFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, CreateFungibleTokenAttributes, OwnerProofAuthProof);
  }
}
