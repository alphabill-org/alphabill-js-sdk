import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { NonFungibleTokenData } from '../NonFungibleTokenData.js';

/**
 * Update non-fungible token attributes array.
 */
export type UpdateNonFungibleTokenAttributesArray = readonly [
  Uint8Array, // Data
  bigint, // Counter
];

/**
 * Update non-fungible token payload attributes.
 */
export class UpdateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Update non-fungible token attributes constructor.
   * @param {INonFungibleTokenData} data - Non-fungible token data.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly data: INonFungibleTokenData,
    public readonly counter: bigint,
  ) {
    this.counter = BigInt(counter);
  }

  /**
   * Create UpdateNonFungibleTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Update non-fungible token attributes as raw CBOR.
   * @returns {UpdateNonFungibleTokenAttributes} Update non-fungible token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): UpdateNonFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new UpdateNonFungibleTokenAttributes(
      NonFungibleTokenData.createFromBytes(CborDecoder.readByteString(data[0])),
      CborDecoder.readUnsignedInteger(data[1]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UpdateNonFungibleTokenAttributes
        Data: ${this.data.toString()}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<UpdateNonFungibleTokenAttributesArray> {
    return Promise.resolve([this.data.bytes, this.counter]);
  }
}
