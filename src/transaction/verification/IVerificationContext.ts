import { RootTrustBase } from '../../RootTrustBase.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { TransactionRecordWithProof } from '../record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../TransactionOrder.js';

export interface IVerificationContext {
  readonly proof: TransactionRecordWithProof<
    TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof | null>
  >;
  readonly trustBase: RootTrustBase;
}
