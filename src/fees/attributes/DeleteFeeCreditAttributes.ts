import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Delete fee credit attributes array.
 */
export type DeleteFeeCreditAttributesArray = readonly [
  bigint, // Counter
];

/**
 * Delete fee credit payload attributes.
 */
export class DeleteFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Delete fee credit attributes constructor.
   * @param {bigint} counter - Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Create DeleteFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Delete fee credit attributes data as raw CBOR.
   * @returns {DeleteFeeCreditAttributes} Delete fee credit attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): DeleteFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new DeleteFeeCreditAttributes(CborDecoder.readUnsignedInteger(data[0]));
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      DeleteFeeCreditAttributes
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<DeleteFeeCreditAttributesArray> {
    return Promise.resolve([this.counter]);
  }
}
