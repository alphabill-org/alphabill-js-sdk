import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionPayload } from '../transaction/TransactionPayload.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { TransactionProofDto } from './StateApiJsonRpcService.js';

export interface ITransactionProofFactory {
  create(
    data: TransactionProofDto,
  ): Promise<TransactionRecordWithProof<TransactionPayload<ITransactionPayloadAttributes>>>;
}
