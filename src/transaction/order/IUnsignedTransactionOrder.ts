import { ISigningService } from '../../signing/ISigningService.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from './TransactionOrder.js';

export interface IUnsignedTransactionOrder<Attributes extends ITransactionPayloadAttributes, Proof> {
  sign(transactionProofSigner: ISigningService, feeProofSigner: ISigningService): Promise<TransactionOrder<Attributes, Proof>>;
}
