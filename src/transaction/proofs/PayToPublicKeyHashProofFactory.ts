import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { IProofFactory } from './IProofFactory.js';

export class PayToPublicKeyHashProofFactory implements IProofFactory {
  public constructor(private readonly signingService: ISigningService) {}

  public create(data: Uint8Array): Uint8Array {
    return CborEncoder.encodeArray([this.signingService.sign(data), this.signingService.publicKey]);
  }
}
