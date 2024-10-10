import { ISigningService } from '../../signing/ISigningService.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { TransactionOrder } from './TransactionOrder.js';

export interface IUnsignedTransactionOrder<
  Attributes extends ITransactionPayloadAttributes,
  AuthProof extends ITransactionOrderProof,
  FeeProof extends ITransactionOrderProof,
> {
  sign(
    authProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<Attributes, AuthProof, FeeProof>>;
}
