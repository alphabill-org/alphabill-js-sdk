export interface IJsonRpcResponse {
  readonly jsonrpc: string;
  readonly result?: string;
  readonly error?: {
    readonly code: number;
    readonly message: string;
  };
  readonly id: string | number | null;
}
