import { IVerificationContext } from './IVerificationContext.js';
import { VerificationResult, VerificationResultCode } from './VerificationResult.js';
import { VerificationRule } from './VerificationRule.js';

export abstract class ConditionalVerificationRule extends VerificationRule {
  private readonly state = new Map<string, VerificationRule>();

  protected constructor(public readonly message: string) {
    super();
  }

  public verify(context: IVerificationContext): Promise<VerificationResult> {
    const rule = this.state.get(this.getCondition(context));
    if (rule) {
      return rule.verify(context);
    }

    return Promise.resolve(
      new VerificationResult(this, this.message, VerificationResultCode.FAIL, 'No rule condition found.'),
    );
  }

  public on(value: string, rule: VerificationRule): this {
    this.state.set(value, rule);
    return this;
  }

  public abstract getCondition(context: IVerificationContext): string;
}
