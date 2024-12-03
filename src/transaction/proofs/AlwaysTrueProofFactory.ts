import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IProofFactory } from './IProofFactory.js';

export class AlwaysTrueProofFactory implements IProofFactory {
  public create(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeNull()]);
  }
}
