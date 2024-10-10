import { dedent } from '../../util/StringUtils.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
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

  /**
   * Create UpdateNonFungibleTokenAttributes from array.
   * @param {UpdateNonFungibleTokenAttributesArray} input - Update non-fungible token attributes array.
   * @returns {UpdateNonFungibleTokenAttributes} Update non-fungible token attributes instance.
   */
  public static fromArray([data, counter]: UpdateNonFungibleTokenAttributesArray): UpdateNonFungibleTokenAttributes {
    return new UpdateNonFungibleTokenAttributes(NonFungibleTokenData.createFromBytes(data), counter);
  }
}
