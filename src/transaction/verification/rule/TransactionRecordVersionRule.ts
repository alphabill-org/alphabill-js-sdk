import { IVerificationContext } from '../IVerificationContext.js';
import { Result, ResultCode } from '../Result.js';
import { Rule } from '../Rule.js';

export class TransactionRecordVersionRule extends Rule {
  public constructor(private readonly allowedVersions: bigint[]) {
    super('TransactionRecordVersionRule');
  }

  public verify(context: IVerificationContext): Promise<Result> {
    if (this.allowedVersions.includes(context.proof.transactionRecord.version)) {
      return Promise.resolve(new Result(this.ruleName, ResultCode.OK));
    }

    return Promise.resolve(
      new Result(
        this.ruleName,
        ResultCode.FAIL,
        `Invalid transaction record version ${context.proof.transactionRecord.version}`,
      ),
    );
  }
}
