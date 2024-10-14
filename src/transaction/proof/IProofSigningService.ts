export interface IProofSigningService {
  sign(data: Uint8Array): Promise<Uint8Array>;
}
