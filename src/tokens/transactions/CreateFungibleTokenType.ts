import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { SubTypeOwnerProofsAuthProof } from '../../transaction/proofs/SubTypeOwnerProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { SubTypeOwnerProofsTransactionOrder } from '../../transaction/SubTypeOwnerProofsTransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
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
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  decimalPlaces: number;
  subTypeCreationPredicate: IPredicate;
  tokenMintingPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
}

export class CreateFungibleTokenType {
  public static create(
    data: ICreateFungibleTokenTypeTransactionData,
  ): SubTypeOwnerProofsTransactionOrder<CreateFungibleTokenTypeAttributes> {
    return new SubTypeOwnerProofsTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.type.unitId,
        TokenPartitionTransactionType.CreateFungibleTokenType,
        new CreateFungibleTokenTypeAttributes(
          data.symbol,
          data.name,
          new TokenIcon(data.icon.type, data.icon.data),
          data.parentTypeId,
          data.decimalPlaces,
          data.subTypeCreationPredicate,
          data.tokenMintingPredicate,
          data.tokenTypeOwnerPredicate,
        ),
        data.stateLock,
        data.metadata,
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
