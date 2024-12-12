import { TransactionStatus } from '../../record/TransactionStatus.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { Result, ResultCode } from '../Result.js';
import { Rule } from '../Rule.js';

export class TransactionRecordWithProofSuccessRule extends Rule {
  public constructor() {
    super('TransactionRecordWithProofSuccessRule');
  }

  public verify(context: IVerificationContext): Promise<Result> {
    if (context.proof.transactionRecord.serverMetadata.successIndicator === TransactionStatus.Successful) {
      return Promise.resolve(new Result(this.ruleName, ResultCode.OK));
    }

    return Promise.resolve(
      new Result(this.ruleName, ResultCode.FAIL, 'Transaction record with proof is not successful.'),
    );
  }
}
