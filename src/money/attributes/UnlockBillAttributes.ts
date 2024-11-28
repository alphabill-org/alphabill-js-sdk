import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Unlock bill attributes array.
 */
export type UnlockBillAttributesArray = readonly [
  bigint, // Counter
];

/**
 * Unlock bill payload attributes.
 */
export class UnlockBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock bill attributes constructor.
   * @param {Uint8Array} counter Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Create UnlockBillAttributes from raw CBOR.
   * @param {Uint8Array} rawData Unlock bill attributes as raw CBOR.
   * @returns {UnlockBillAttributes} Unlock bill attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): UnlockBillAttributes {
    const data = CborDecoder.readArray(rawData);
    return new UnlockBillAttributes(CborDecoder.readUnsignedInteger(data[0]));
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockBillAttributes
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<UnlockBillAttributesArray> {
    return Promise.resolve([this.counter]);
  }
}
