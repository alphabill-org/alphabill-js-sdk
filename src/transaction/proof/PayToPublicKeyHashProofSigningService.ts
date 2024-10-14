import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';

export class PayToPublicKeyHashProofSigningService {
  public constructor(
    private readonly signingService: ISigningService,
    private readonly cborCodec: ICborCodec,
  ) {}

  public sign(data: Uint8Array): Promise<Uint8Array> {
    return this.cborCodec.encode([this.signingService.sign(data), this.signingService.publicKey]);
  }
}
