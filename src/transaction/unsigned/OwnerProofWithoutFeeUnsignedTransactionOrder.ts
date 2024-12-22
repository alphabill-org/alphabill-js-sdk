import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { IProofFactory } from '../proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../proofs/OwnerProofAuthProof.js';
import { OwnerProofUnsignedTransactionOrder } from './OwnerProofUnsignedTransactionOrder.js';

export class OwnerProofWithoutFeeUnsignedTransactionOrder<
  Attributes extends ITransactionPayloadAttributes,
> extends OwnerProofUnsignedTransactionOrder<Attributes> {
  public sign(ownerProofFactory: IProofFactory): Promise<TransactionOrder<Attributes, OwnerProofAuthProof>> {
    return super.sign(ownerProofFactory, null);
  }
}
