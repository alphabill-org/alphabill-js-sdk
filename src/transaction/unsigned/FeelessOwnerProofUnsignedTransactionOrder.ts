import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IProofFactory } from '../proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../proofs/OwnerProofAuthProof.js';
import { TransactionOrder } from '../TransactionOrder.js';
import { OwnerProofUnsignedTransactionOrder } from './OwnerProofUnsignedTransactionOrder.js';

export class FeelessOwnerProofUnsignedTransactionOrder<
  Attributes extends ITransactionPayloadAttributes,
> extends OwnerProofUnsignedTransactionOrder<Attributes> {
  public sign(ownerProofFactory: IProofFactory): Promise<TransactionOrder<Attributes, OwnerProofAuthProof>> {
    return super.sign(ownerProofFactory, null);
  }
}
