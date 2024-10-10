import { IUnitId } from '../../IUnitId.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Create fungible token attributes array.
 */
export type CreateFungibleTokenAttributesArray = readonly [
  Uint8Array, // Type ID
  bigint, // Value
  Uint8Array, // Owner predicate
  bigint, // Nonce
];

/**
 * Create fungible token payload attributes.
 */
export class CreateFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Create fungible token payload attributes constructor.
   * @param {IPredicate} ownerPredicate Initial owner predicate of the new token.
   * @param {IUnitId} typeId Token type ID.
   * @param {bigint} value Token value.
   * @param {bigint} nonce Optional nonce.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly nonce: bigint,
  ) {
    this.value = BigInt(this.value);
    this.nonce = BigInt(this.nonce);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      CreateFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Nonce: ${this.nonce}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<CreateFungibleTokenAttributesArray> {
    return Promise.resolve([this.typeId.bytes, this.value, this.ownerPredicate.bytes, this.nonce]);
  }

  /**
   * Create CreateFungibleTokenAttributes from array.
   * @param {CreateFungibleTokenAttributesArray} data Create fungible token attributes array.
   * @returns {CreateFungibleTokenAttributes} Create fungible token attributes instance.
   */
  public static fromArray([
    typeId,
    value,
    ownerPredicate,
    nonce,
  ]: CreateFungibleTokenAttributesArray): CreateFungibleTokenAttributes {
    return new CreateFungibleTokenAttributes(
      new PredicateBytes(ownerPredicate),
      UnitId.fromBytes(typeId),
      value,
      nonce,
    );
  }
}
