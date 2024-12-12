import { IVerificationContext } from '../IVerificationContext.js';
import { Result, ResultCode } from '../Result.js';
import { Rule } from '../Rule.js';

export class TransactionProofVersionRule extends Rule {
  public constructor(private readonly allowedVersions: bigint[]) {
    super('TransactionProofVersionRule');
  }

  public verify(context: IVerificationContext): Promise<Result> {
    if (this.allowedVersions.includes(context.proof.transactionProof.version)) {
      return Promise.resolve(new Result(this.ruleName, ResultCode.OK));
    }

    return Promise.resolve(
      new Result(
        this.ruleName,
        ResultCode.FAIL,
        `Invalid transaction proof version ${context.proof.transactionProof.version}`,
      ),
    );
  }
}
