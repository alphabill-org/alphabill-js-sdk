import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transfer fungible token attributes array.
 */
export type TransferFungibleTokenAttributesArray = readonly [
  Uint8Array, // Type ID
  bigint, // Value
  Uint8Array, // Owner Predicate
  bigint, // Counter
];

/**
 * Transfer fungible token payload attributes.
 */
export class TransferFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer fungible token attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} value - Value.
   * @param {bigint} counter - Counter.
   * @param {IUnitId} typeId - Type ID.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly value: bigint,
    public readonly counter: bigint,
    public readonly typeId: IUnitId,
  ) {
    this.value = BigInt(this.value);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create TransferFungibleTokenAttributesArray from array.
   * @param {TransferFungibleTokenAttributesArray} data - Transfer fungible token attributes array.
   * @returns {TransferFungibleTokenAttributes} Transfer fungible token attributes instance.
   */
  public static fromArray([
    typeId,
    value,
    ownerPredicate,
    counter,
  ]: TransferFungibleTokenAttributesArray): TransferFungibleTokenAttributes {
    return new TransferFungibleTokenAttributes(
      new PredicateBytes(ownerPredicate),
      value,
      counter,
      UnitId.fromBytes(typeId),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Value: ${this.value}
        Counter: ${this.counter}
        Type ID: ${this.typeId.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<TransferFungibleTokenAttributesArray> {
    return Promise.resolve([this.typeId.bytes, this.value, this.ownerPredicate.bytes, this.counter]);
  }
}
