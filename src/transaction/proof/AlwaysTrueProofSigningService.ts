import { ICborCodec } from '../../codec/cbor/ICborCodec.js';

export class AlwaysTrueProofSigningService {
  public constructor(private readonly cborCodec: ICborCodec) {}

  public sign(): Promise<Uint8Array> {
    return this.cborCodec.encode(null);
  }
}
