import { IUnitId } from '../../IUnitId.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { SubTypeOwnerProofsAuthProof } from '../../transaction/proofs/SubTypeOwnerProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { SubTypeOwnerProofsUnsignedTransactionOrder } from '../../transaction/unsigned/SubTypeOwnerProofsUnsignedTransactionOrder.js';
import { CreateNonFungibleTokenTypeAttributes } from '../attributes/CreateNonFungibleTokenTypeAttributes.js';
import { TokenIcon } from '../TokenIcon.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type CreateNonFungibleTokenTypeTransactionOrder = TransactionOrder<
  CreateNonFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof
>;
interface ICreateNonFungibleTokenTypeTransactionData extends ITransactionData {
  typeId: IUnitId;
  symbol: string;
  name: string | null;
  icon: { type: string; data: Uint8Array } | null;
  parentTypeId: IUnitId | null;
  subTypeCreationPredicate: IPredicate;
  tokenMintingPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
  dataUpdatePredicate: IPredicate;
}

export class CreateNonFungibleTokenType {
  public static create(
    data: ICreateNonFungibleTokenTypeTransactionData,
  ): SubTypeOwnerProofsUnsignedTransactionOrder<CreateNonFungibleTokenTypeAttributes> {
    return new SubTypeOwnerProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.typeId,
        TokenPartitionTransactionType.CreateNonFungibleTokenType,
        new CreateNonFungibleTokenTypeAttributes(
          data.symbol,
          data.name,
          data.icon ? new TokenIcon(data.icon.type, data.icon.data) : null,
          data.parentTypeId,
          data.subTypeCreationPredicate,
          data.tokenMintingPredicate,
          data.tokenTypeOwnerPredicate,
          data.dataUpdatePredicate,
        ),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<CreateNonFungibleTokenTypeTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(
      bytes,
      CreateNonFungibleTokenTypeAttributes,
      SubTypeOwnerProofsAuthProof,
    );
  }
}
