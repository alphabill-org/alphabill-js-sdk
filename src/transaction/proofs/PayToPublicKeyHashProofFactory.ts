import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { IProofFactory } from './IProofFactory.js';

export class PayToPublicKeyHashProofFactory implements IProofFactory {
  public constructor(
    private readonly signingService: ISigningService,
    private readonly cborCodec: ICborCodec,
  ) {}

  public async create(data: Uint8Array): Promise<Uint8Array> {
    return this.cborCodec.encode([await this.signingService.sign(data), this.signingService.publicKey]);
  }
}
