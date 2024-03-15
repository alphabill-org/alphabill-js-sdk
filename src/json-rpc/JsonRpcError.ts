export class JsonRpcError implements Error {
  public readonly code: number;
  public readonly message: string;
  public readonly name: string;

  public constructor({ code, message }: { code: number; message: string }) {
    this.code = code;
    this.message = message;
  }

  public toString(): string {
    return `{ code: ${this.code}, message: ${this.message} }`;
  }
}
