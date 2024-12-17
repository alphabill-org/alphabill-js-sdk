import { IVerificationContext } from './IVerificationContext.js';
import { Result, ResultCode } from './Result.js';
import { Rule } from './Rule.js';

export abstract class ConditionalRule extends Rule {
  private readonly state = new Map<string, Rule>();

  public constructor(public readonly message: string) {
    super();
  }

  public verify(context: IVerificationContext): Promise<Result> {
    const rule = this.state.get(this.getCondition(context));
    if (rule) {
      return rule.verify(context);
    }

    return Promise.resolve(new Result(this, this.message, ResultCode.FAIL, 'No rule condition found.'));
  }

  public on(value: string, rule: Rule): Rule {
    this.state.set(value, rule);
    return rule;
  }

  public abstract getCondition(context: IVerificationContext): string;
}
