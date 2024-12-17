import { IVerificationContext } from './IVerificationContext.js';
import { Result } from './Result.js';
import { Rule } from './Rule.js';

export class AggregatedRule extends Rule {
  public constructor(
    public readonly message: string,
    public readonly firstRule: Rule,
  ) {
    super();
  }

  public async verify(context: IVerificationContext): Promise<Result> {
    let verificationRule: Rule | null = this.firstRule;
    const verificationResults: Result[] = [];

    while (verificationRule !== null) {
      const result: Result = await verificationRule.verify(context);
      verificationResults.push(result);
      verificationRule = result.rule.getNextRule(result.resultCode);
    }

    return Result.createFromResults(this, this.message, verificationResults);
  }
}
