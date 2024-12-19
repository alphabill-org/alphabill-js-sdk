import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { IProofFactory } from './IProofFactory.js';

export class PayToPublicKeyHashProofFactory implements IProofFactory {
  public constructor(private readonly signingService: ISigningService) {}

  public async create(data: Uint8Array): Promise<Uint8Array> {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(await this.signingService.sign(data)),
      CborEncoder.encodeByteString(this.signingService.publicKey),
    ]);
  }
}
