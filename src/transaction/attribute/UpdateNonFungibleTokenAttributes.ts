import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { NonFungibleTokenData } from '../NonFungibleTokenData.js';
import { PayloadType } from '../PayloadAttributeFactory.js';

/**
 * Update non-fungible token attributes array.
 */
export type UpdateNonFungibleTokenAttributesArray = readonly [Uint8Array, bigint, Uint8Array[] | null];

/**
 * Update non-fungible token payload attributes.
 */
export class UpdateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Update non-fungible token attributes constructor.
   * @param {INonFungibleTokenData} data - Non-fungible token data.
   * @param {bigint} counter - Counter.
   * @param {Uint8Array[] | null} _dataUpdateSignatures - Data update signatures.
   */
  public constructor(
    public readonly data: INonFungibleTokenData,
    public readonly counter: bigint,
    private readonly _dataUpdateSignatures: Uint8Array[] | null,
  ) {
    this.counter = BigInt(counter);
    this._dataUpdateSignatures = this._dataUpdateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.UpdateNonFungibleTokenAttributes;
  }

  /**
   * Get data update signatures.
   * @returns {Uint8Array[] | null} Data update signatures.
   */
  public get dataUpdateSignatures(): Uint8Array[] | null {
    return this._dataUpdateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): UpdateNonFungibleTokenAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): UpdateNonFungibleTokenAttributesArray {
    return [this.data.bytes, this.counter, this.dataUpdateSignatures];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UpdateNonFungibleTokenAttributes
        Data: ${this.data.toString()}
        Counter: ${this.counter}
        Data Update Signatures: ${this._dataUpdateSignatures?.map((signature) => Base16Converter.encode(signature))}`;
  }

  /**
   * Create UpdateNonFungibleTokenAttributes from array.
   * @param {UpdateNonFungibleTokenAttributesArray} data - Update non-fungible token attributes array.
   * @returns {UpdateNonFungibleTokenAttributes} Update non-fungible token attributes instance.
   */
  public static fromArray(data: UpdateNonFungibleTokenAttributesArray): UpdateNonFungibleTokenAttributes {
    return new UpdateNonFungibleTokenAttributes(NonFungibleTokenData.createFromBytes(data[0]), data[1], data[2]);
  }
}
