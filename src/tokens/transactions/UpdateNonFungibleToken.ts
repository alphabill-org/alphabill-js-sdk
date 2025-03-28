import { IUnitId } from '../../IUnitId.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { TypeDataUpdateProofsAuthProof } from '../../transaction/proofs/TypeDataUpdateProofsAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TypeDataUpdateProofsUnsignedTransactionOrder } from '../../transaction/unsigned/TypeDataUpdateProofsUnsignedTransactionOrder.js';
import { UpdateNonFungibleTokenAttributes } from '../attributes/UpdateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type UpdateNonFungibleTokenTransactionOrder = TransactionOrder<
  UpdateNonFungibleTokenAttributes,
  TypeDataUpdateProofsAuthProof
>;
interface IUpdateNonFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  data: INonFungibleTokenData;
}

export class UpdateNonFungibleToken {
  public static create(
    data: IUpdateNonFungibleTokenTransactionData,
  ): TypeDataUpdateProofsUnsignedTransactionOrder<UpdateNonFungibleTokenAttributes> {
    return new TypeDataUpdateProofsUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.token.unitId,
        TokenPartitionTransactionType.UpdateNonFungibleToken,
        new UpdateNonFungibleTokenAttributes(data.data, data.token.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<UpdateNonFungibleTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, UpdateNonFungibleTokenAttributes, TypeDataUpdateProofsAuthProof);
  }
}
