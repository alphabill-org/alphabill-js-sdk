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
import { CreateNonFungibleTokenAttributes } from '../attributes/CreateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TokenUnitId } from '../TokenUnitId.js';

export type CreateNonFungibleTokenTransactionOrder = TransactionOrder<
  CreateNonFungibleTokenAttributes,
  OwnerProofAuthProof
>;
interface ICreateNonFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  name: string;
  uri: string;
  data: INonFungibleTokenData;
  dataUpdatePredicate: IPredicate;
  nonce: bigint;
}

export class CreateNonFungibleToken {
  public static create(
    data: ICreateNonFungibleTokenTransactionData,
  ): OwnerProofUnsignedTransactionOrder<CreateNonFungibleTokenAttributes> {
    const attributes = new CreateNonFungibleTokenAttributes(
      data.type.unitId,
      data.name,
      data.uri,
      data.data,
      data.ownerPredicate,
      data.dataUpdatePredicate,
      data.nonce,
    );
    const metadata = ClientMetadata.create(data.metadata);
    const tokenUnitId = TokenUnitId.create(attributes, metadata, TokenPartitionUnitType.NON_FUNGIBLE_TOKEN);
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        tokenUnitId,
        TokenPartitionTransactionType.CreateNonFungibleToken,
        attributes,
        data.stateLock,
        metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<CreateNonFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, CreateNonFungibleTokenAttributes, OwnerProofAuthProof);
  }
}
