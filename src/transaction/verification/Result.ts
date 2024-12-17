import { Rule } from './Rule.js';

export enum ResultCode {
  OK,
  FAIL,
  NA,
}

/**
 * Verification result
 */
export class Result {
  private readonly _childResults: Result[];

  public constructor(
    public readonly rule: Rule,
    public readonly message: string,
    public readonly resultCode: ResultCode,
    public readonly verificationError: string | null = null,
    childResults: ReadonlyArray<Result> | null = null,
  ) {
    this._childResults = childResults?.slice() ?? [];
  }

  public get childResults(): Result[] {
    return this._childResults.slice();
  }

  public static createFromResults(rule: Rule, message: string, childResults: ReadonlyArray<Result>): Result {
    const lastResult: Result =
      childResults.length > 0 ? childResults[childResults.length - 1] : new Result(rule, message, ResultCode.OK);

    return new Result(rule, message, lastResult.resultCode, null, childResults);
  }

  public toString(): string {
    let result = `${this.message} [${ResultCode[this.resultCode]}${this.verificationError ? `, "${this.verificationError}"` : ''}]`;

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
