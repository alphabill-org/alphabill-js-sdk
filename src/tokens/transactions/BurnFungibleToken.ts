import { IUnitId } from '../../IUnitId.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TypeOwnerProofsUnsignedTransactionOrder } from '../../transaction/unsigned/TypeOwnerProofsUnsignedTransactionOrder.js';
import { BurnFungibleTokenAttributes } from '../attributes/BurnFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type BurnFungibleTokenTransactionOrder = TransactionOrder<BurnFungibleTokenAttributes, TypeOwnerProofsAuthProof>;
interface IBurnFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint; typeId: IUnitId };
  targetToken: { unitId: IUnitId; counter: bigint };
}

export class BurnFungibleToken {
  public static create(
    data: IBurnFungibleTokenTransactionData,
  ): TypeOwnerProofsUnsignedTransactionOrder<BurnFungibleTokenAttributes> {
    return new TypeOwnerProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.token.unitId,
        TokenPartitionTransactionType.BurnFungibleToken,
        new BurnFungibleTokenAttributes(
          data.token.typeId,
          data.token.value,
          data.targetToken.unitId,
          data.targetToken.counter,
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
  ): TransactionRecordWithProof<BurnFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, BurnFungibleTokenAttributes, TypeOwnerProofsAuthProof);
  }
}
