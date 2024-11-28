import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { IStateLock } from './IStateLock.js';
import { IPredicate } from './predicates/IPredicate.js';
import { PredicateBytes } from './predicates/PredicateBytes.js';

export type StateLockArray = [Uint8Array, Uint8Array];

export class StateLock implements IStateLock {
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

  public encode(): StateLockArray {
    return [this.executionPredicate.bytes, this.rollbackPredicate.bytes];
  }
}
