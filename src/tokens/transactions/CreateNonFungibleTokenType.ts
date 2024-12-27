import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
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
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
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
        PartitionIdentifier.TOKEN,
        data.type.unitId,
        TokenPartitionTransactionType.CreateNonFungibleTokenType,
        new CreateNonFungibleTokenTypeAttributes(
          data.symbol,
          data.name,
          new TokenIcon(data.icon.type, data.icon.data),
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
