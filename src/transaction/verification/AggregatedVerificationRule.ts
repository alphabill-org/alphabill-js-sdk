import { IVerificationContext } from './IVerificationContext.js';
import { VerificationResult } from './VerificationResult.js';
import { VerificationRule } from './VerificationRule.js';

export class AggregatedVerificationRule extends VerificationRule {
  public constructor(
    public readonly message: string,
    public readonly firstRule: VerificationRule,
  ) {
    super();
  }

  public async verify(context: IVerificationContext): Promise<VerificationResult> {
    let verificationRule: VerificationRule | null = this.firstRule;
    const verificationResults: VerificationResult[] = [];

    while (verificationRule !== null) {
      const result: VerificationResult = await verificationRule.verify(context);
      verificationResults.push(result);
      verificationRule = result.rule.getNextRule(result.resultCode);
    }

    return VerificationResult.createFromResults(this, this.message, verificationResults);
  }
}
