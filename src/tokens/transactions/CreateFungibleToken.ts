import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
import { CreateFungibleTokenAttributes } from '../attributes/CreateFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TokenUnitId } from '../TokenUnitId.js';

export type CreateFungibleTokenTransactionOrder = TransactionOrder<CreateFungibleTokenAttributes, OwnerProofAuthProof>;
interface ICreateFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  typeId: IUnitId;
  value: bigint;
  nonce: bigint;
}

export class CreateFungibleToken {
  public static create(
    data: ICreateFungibleTokenTransactionData,
  ): OwnerProofUnsignedTransactionOrder<CreateFungibleTokenAttributes> {
    const attributes = new CreateFungibleTokenAttributes(data.typeId, data.value, data.ownerPredicate, data.nonce);
    const metadata = ClientMetadata.create(data.metadata);
    const tokenUnitId = TokenUnitId.create(attributes, metadata, TokenPartitionUnitType.FUNGIBLE_TOKEN);
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        tokenUnitId,
        TokenPartitionTransactionType.CreateFungibleToken,
        attributes,
        data.stateLock,
        metadata,
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
