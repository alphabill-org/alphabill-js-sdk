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
import { CreateFungibleTokenTypeAttributes } from '../attributes/CreateFungibleTokenTypeAttributes.js';
import { TokenIcon } from '../TokenIcon.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type CreateFungibleTokenTypeTransactionOrder = TransactionOrder<
  CreateFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof
>;
interface ICreateFungibleTokenTypeTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string | null;
  icon: { type: string; data: Uint8Array } | null;
  parentTypeId: IUnitId | null;
  decimalPlaces: number;
  subTypeCreationPredicate: IPredicate;
  tokenMintingPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
}

export class CreateFungibleTokenType {
  public static create(
    data: ICreateFungibleTokenTypeTransactionData,
  ): SubTypeOwnerProofsUnsignedTransactionOrder<CreateFungibleTokenTypeAttributes> {
    return new SubTypeOwnerProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.type.unitId,
        TokenPartitionTransactionType.CreateFungibleTokenType,
        new CreateFungibleTokenTypeAttributes(
          data.symbol,
          data.name,
          data.icon ? new TokenIcon(data.icon.type, data.icon.data) : null,
          data.parentTypeId,
          data.decimalPlaces,
          data.subTypeCreationPredicate,
          data.tokenMintingPredicate,
          data.tokenTypeOwnerPredicate,
        ),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<CreateFungibleTokenTypeTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, CreateFungibleTokenTypeAttributes, SubTypeOwnerProofsAuthProof);
  }
}
