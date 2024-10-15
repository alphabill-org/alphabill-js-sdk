export interface IProofFactory {
  create(data: Uint8Array): Promise<Uint8Array>;
}
