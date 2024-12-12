import { IVerificationContext } from './IVerificationContext.js';
import { Result } from './Result.js';
import { Rule } from './Rule.js';

export class AggregatedRule extends Rule {
  public constructor(
    message: string,
    public readonly firstRule: Rule,
  ) {
    super(message);
  }

  public async verify(context: IVerificationContext): Promise<Result> {
    let verificationRule: Rule | null = this.firstRule;
    const verificationResults: Result[] = [];

    while (verificationRule !== null) {
      const result: Result = await verificationRule.verify(context);
      verificationResults.push(result);
      verificationRule = verificationRule.getNextRule(result.resultCode);
    }

    return Result.createFromResults(this.ruleName, verificationResults);
  }
}
