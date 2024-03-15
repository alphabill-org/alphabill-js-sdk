export interface ICborCodec {
  encode(input: unknown): Promise<Uint8Array>;
  decode(input: Uint8Array): Promise<unknown>;
}
