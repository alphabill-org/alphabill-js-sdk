import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IProofFactory } from './IProofFactory.js';

export class AlwaysTrueProofFactory implements IProofFactory {
  public constructor(private readonly cborCodec: ICborCodec) {}

  public create(): Promise<Uint8Array> {
    return this.cborCodec.encode(null);
  }
}
