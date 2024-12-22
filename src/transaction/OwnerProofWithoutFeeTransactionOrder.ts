import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionOrder } from './order/TransactionOrder.js';
import { OwnerProofTransactionOrder } from './OwnerProofTransactionOrder.js';
import { IProofFactory } from './proofs/IProofFactory.js';
import { OwnerProofAuthProof } from './proofs/OwnerProofAuthProof.js';

export class OwnerProofWithoutFeeTransactionOrder<
  Attributes extends ITransactionPayloadAttributes,
> extends OwnerProofTransactionOrder<Attributes> {
  public sign(ownerProofFactory: IProofFactory): Promise<TransactionOrder<Attributes, OwnerProofAuthProof>> {
    return super.sign(ownerProofFactory, null);
  }
}
