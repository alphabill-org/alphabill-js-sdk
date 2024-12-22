import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
import { UnlockTokenAttributes } from '../attributes/UnlockTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export type UnlockTokenTransactionOrder = TransactionOrder<UnlockTokenAttributes, OwnerProofAuthProof>;
export interface IUnlockTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
}

export class UnlockToken {
  public static create(data: IUnlockTokenTransactionData): OwnerProofUnsignedTransactionOrder<UnlockTokenAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.UnlockToken,
        new UnlockTokenAttributes(data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<UnlockTokenTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, UnlockTokenAttributes, OwnerProofAuthProof);
  }
}
