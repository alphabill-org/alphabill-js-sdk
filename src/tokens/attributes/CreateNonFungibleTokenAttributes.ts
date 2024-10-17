import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { NonFungibleTokenData } from '../NonFungibleTokenData.js';

/**
 * Create non-fungible token attributes array.
 */
export type CreateNonFungibleTokenAttributesArray = readonly [
  Uint8Array, // Type ID
  string, // Name
  string, // URI
  Uint8Array, // Data
  Uint8Array, // Owner predicate
  Uint8Array, // Data update predicate
  bigint, // Nonce
];

/**
 * Create non-fungible token payload attributes.
 */
export class CreateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Create non-fungible token payload attributes constructor.
   * @param {IPredicate} ownerPredicate Initial owner predicate of the new token.
   * @param {IUnitId} typeId Token type ID.
   * @param {string} name Name.
   * @param {string} uri URI.
   * @param {INonFungibleTokenData} data Data.
   * @param {IPredicate} dataUpdatePredicate Data update predicate of the new token.
   * @param {bigint} nonce Optional nonce.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    public readonly data: INonFungibleTokenData,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly nonce: bigint,
  ) {
    this.nonce = BigInt(this.nonce);
  }

  /**
   * Create CreateNonFungibleTokenAttributes from array.
   * @param {CreateNonFungibleTokenAttributesArray} attributes Create non-fungible token attributes array.
   * @returns {CreateNonFungibleTokenAttributes} Create non-fungible token attributes instance.
   */
  public static fromArray([
    typeId,
    name,
    uri,
    data,
    ownerPredicate,
    dataUpdatePredicate,
    nonce,
  ]: CreateNonFungibleTokenAttributesArray): CreateNonFungibleTokenAttributes {
    return new CreateNonFungibleTokenAttributes(
      new PredicateBytes(ownerPredicate),
      UnitId.fromBytes(typeId),
      name,
      uri,
      NonFungibleTokenData.createFromBytes(data),
      new PredicateBytes(dataUpdatePredicate),
      nonce,
    );
  }

  /**
   * Convert to string.
   * @returns {string} String.
   */
  public toString(): string {
    return dedent`
      CreateNonFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${this.data.toString()}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Nonce: ${this.nonce}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<CreateNonFungibleTokenAttributesArray> {
    return Promise.resolve([
      this.typeId.bytes,
      this.name,
      this.uri,
      this.data.bytes,
      this.ownerPredicate.bytes,
      this.dataUpdatePredicate.bytes,
      this.nonce,
    ]);
  }
}
