import { TransactionStatus } from '../../record/TransactionStatus.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { Result, ResultCode } from '../Result.js';
import { Rule } from '../Rule.js';

export class TransactionRecordWithProofSuccessRule extends Rule {
  public static readonly MESSAGE = 'Is transaction record with proof successful';

  public verify(context: IVerificationContext): Promise<Result> {
    if (context.proof.transactionRecord.serverMetadata.successIndicator === TransactionStatus.Successful) {
      return Promise.resolve(new Result(this, TransactionRecordWithProofSuccessRule.MESSAGE, ResultCode.OK));
    }

    return Promise.resolve(
      new Result(
        this,
        TransactionRecordWithProofSuccessRule.MESSAGE,
        ResultCode.FAIL,
        'Transaction record with proof is not successful.',
      ),
    );
  }
}
