import { IVerificationContext } from './IVerificationContext.js';
import { VerificationResult, VerificationResultCode } from './VerificationResult.js';

/**
 * Verification Rule
 */
export abstract class VerificationRule {
  private onSuccessRule: VerificationRule | null = null;
  private onFailureRule: VerificationRule | null = null;
  private onNaRule: VerificationRule | null = null;

  protected constructor() {}

  public onSuccess(rule: VerificationRule): VerificationRule {
    this.onSuccessRule = rule;

    return this;
  }

  public onFailure(rule: VerificationRule): VerificationRule {
    this.onFailureRule = rule;

    return this;
  }

  public onNa(rule: VerificationRule): VerificationRule {
    this.onNaRule = rule;

    return this;
  }

  public onAny(rule: VerificationRule): VerificationRule {
    return this.onSuccess(rule).onFailure(rule).onNa(rule);
  }

  public getNextRule(resultCode: VerificationResultCode): VerificationRule | null {
    switch (resultCode) {
      case VerificationResultCode.OK:
        return this.onSuccessRule;
      case VerificationResultCode.FAIL:
        return this.onFailureRule;
      case VerificationResultCode.NA:
        return this.onNaRule;
      default:
        return null;
    }
  }

  public abstract verify(context: IVerificationContext): Promise<VerificationResult>;
}
