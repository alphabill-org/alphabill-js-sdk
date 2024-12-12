export enum ResultCode {
  OK,
  FAIL,
  NA,
}

/**
 * Verification result
 */
export class Result {
  private readonly childResults: Result[] = [];

  public constructor(
    public readonly ruleName: string,
    public readonly resultCode: ResultCode,
    public readonly verificationError: string | null = null,
    childResults: ReadonlyArray<Result> | null = null,
  ) {
    this.ruleName = ruleName;
    this.resultCode = resultCode;
    this.verificationError = verificationError || null;

    if (childResults !== null) {
      this.childResults = childResults.slice();
    }
  }

  public static createFromResults(message: string, childResults: ReadonlyArray<Result>): Result {
    const lastResult: Result =
      childResults.length > 0 ? childResults[childResults.length - 1] : new Result(message, ResultCode.OK);

    return new Result(message, lastResult.resultCode, lastResult.verificationError, childResults);
  }

  public getChildResults(): Result[] {
    return this.childResults.slice();
  }

  public toString(): string {
    let result = `VerificationResult ${this.ruleName} [${ResultCode[this.resultCode]}]: `;

    if (this.childResults.length > 0) {
      result = this.writeChildResults(result);
    } else {
      result += this.verificationError;
    }

    return result;
  }

  private writeChildResults(result: string): string {
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
