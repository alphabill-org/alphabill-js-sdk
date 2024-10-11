import { ISigningService } from '../../signing/ISigningService.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { TransactionOrder } from './TransactionOrder.js';

export interface IUnsignedTransactionOrder<
  T extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof, ITransactionOrderProof>,
> {
  sign(authProofSigner: ISigningService, feeProofSigner: ISigningService): Promise<T>;
}
