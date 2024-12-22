import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TypeOwnerProofsUnsignedTransactionOrder } from '../../transaction/unsigned/TypeOwnerProofsUnsignedTransactionOrder.js';
import { JoinFungibleTokenAttributes } from '../attributes/JoinFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { BurnFungibleTokenTransactionOrder } from './BurnFungibleToken.js';

export type JoinFungibleTokenTransactionOrder = TransactionOrder<JoinFungibleTokenAttributes, TypeOwnerProofsAuthProof>;
interface IJoinFungibleTokensTransactionData extends ITransactionData {
  token: { unitId: IUnitId };
  proofs: TransactionRecordWithProof<BurnFungibleTokenTransactionOrder>[];
}

export class JoinFungibleToken {
  public static create(
    data: IJoinFungibleTokensTransactionData,
  ): TypeOwnerProofsUnsignedTransactionOrder<JoinFungibleTokenAttributes> {
    return new TypeOwnerProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.JoinFungibleToken,
        new JoinFungibleTokenAttributes(data.proofs),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<JoinFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, JoinFungibleTokenAttributes, TypeOwnerProofsAuthProof);
  }
}
