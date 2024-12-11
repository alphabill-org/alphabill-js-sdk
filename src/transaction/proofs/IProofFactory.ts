export interface IProofFactory {
  create(data: Uint8Array): Uint8Array;
}
