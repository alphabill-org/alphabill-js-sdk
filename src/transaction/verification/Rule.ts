import { IVerificationContext } from './IVerificationContext.js';
import { Result, ResultCode } from './Result.js';

/**
 * Verification Rule for KSI Signature
 */
export abstract class Rule {
  private onSuccessRule: Rule | null = null;
  private onFailureRule: Rule | null = null;
  private onNaRule: Rule | null = null;

  protected constructor() {}

  public onSuccess(rule: Rule): Rule {
    this.onSuccessRule = rule;

    return this;
  }

  public onFailure(rule: Rule): Rule {
    this.onFailureRule = rule;

    return this;
  }

  public onNa(rule: Rule): Rule {
    this.onNaRule = rule;

    return this;
  }

  public onAny(rule: Rule): Rule {
    return this.onSuccess(rule).onFailure(rule).onNa(rule);
  }

  public getNextRule(resultCode: ResultCode): Rule | null {
    switch (resultCode) {
      case ResultCode.OK:
        return this.onSuccessRule;
      case ResultCode.FAIL:
        return this.onFailureRule;
      case ResultCode.NA:
        return this.onNaRule;
      default:
        return null;
    }
  }

  public abstract verify(context: IVerificationContext): Promise<Result>;
}
