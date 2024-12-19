import { VerificationRule } from './VerificationRule.js';

export enum VerificationResultCode {
  OK,
  FAIL,
  NA,
}

/**
 * Verification result
 */
export class VerificationResult {
  private readonly _childResults: VerificationResult[];

  public constructor(
    public readonly rule: VerificationRule,
    public readonly message: string,
    public readonly resultCode: VerificationResultCode,
    public readonly verificationError: string | null = null,
    childResults: ReadonlyArray<VerificationResult> | null = null,
  ) {
    this._childResults = childResults?.slice() ?? [];
  }

  public get childResults(): VerificationResult[] {
    return this._childResults.slice();
  }

  public static createFromResults(
    rule: VerificationRule,
    message: string,
    childResults: ReadonlyArray<VerificationResult>,
  ): VerificationResult {
    const lastResult: VerificationResult =
      childResults.length > 0
        ? childResults[childResults.length - 1]
        : new VerificationResult(rule, message, VerificationResultCode.OK);

    return new VerificationResult(rule, message, lastResult.resultCode, null, childResults);
  }

  public toString(): string {
    let result = `${this.message} [${VerificationResultCode[this.resultCode]}${this.verificationError ? `, "${this.verificationError}"` : ''}]`;

    if (this.childResults.length > 0) {
      result = `${this.writeChildResults(result)}`;
    }

    return result;
  }

  private writeChildResults(result: string): string {
    result += ':\n';
    for (let i = 0; i < this.childResults.length; i += 1) {
      result += this.childResults[i]
        .toString()
        .split('\n')
        .map((row) => `  ${row}`)
        .join('\n');
      if (i < this.childResults.length - 1) {
        result += '\n';
      }
    }

    return result;
  }
}
