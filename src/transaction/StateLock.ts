import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../codec/cbor/CborEncoder.js';
import { IPredicate } from './predicates/IPredicate.js';
import { PredicateBytes } from './predicates/PredicateBytes.js';

export class StateLock {
  public constructor(
    public readonly executionPredicate: IPredicate,
    public readonly rollbackPredicate: IPredicate,
  ) {}

  public static fromCbor(rawData: Uint8Array): StateLock {
    const data = CborDecoder.readArray(rawData);
    return new StateLock(
      new PredicateBytes(CborDecoder.readByteString(data[0])),
      new PredicateBytes(CborDecoder.readByteString(data[1])),
    );
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.executionPredicate.bytes),
      CborEncoder.encodeByteString(this.rollbackPredicate.bytes),
    ]);
  }
}
