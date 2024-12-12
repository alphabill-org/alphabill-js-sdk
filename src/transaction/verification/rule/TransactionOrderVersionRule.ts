import { IVerificationContext } from '../IVerificationContext.js';
import { Result, ResultCode } from '../Result.js';
import { Rule } from '../Rule.js';

export class TransactionOrderVersionRule extends Rule {
  public constructor(private readonly allowedVersions: bigint[]) {
    super('TransactionOrderVersionRule');
  }

  public verify(context: IVerificationContext): Promise<Result> {
    if (this.allowedVersions.includes(context.proof.transactionRecord.transactionOrder.version)) {
      return Promise.resolve(new Result(this.ruleName, ResultCode.OK));
    }

    return Promise.resolve(
      new Result(
        this.ruleName,
        ResultCode.FAIL,
        `Invalid transaction order version ${context.proof.transactionRecord.transactionOrder.version}`,
      ),
    );
  }
}
