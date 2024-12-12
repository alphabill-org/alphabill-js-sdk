import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { TransactionRecordWithProof } from '../record/TransactionRecordWithProof.js';

export interface IVerificationContext {
  readonly proof: TransactionRecordWithProof<TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof>>;
}
