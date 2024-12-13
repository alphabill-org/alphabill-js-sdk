import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IProofFactory } from './IProofFactory.js';

export class AlwaysTrueProofFactory implements IProofFactory {
  public create(): Promise<Uint8Array> {
    return Promise.resolve(CborEncoder.encodeNull());
  }
}
