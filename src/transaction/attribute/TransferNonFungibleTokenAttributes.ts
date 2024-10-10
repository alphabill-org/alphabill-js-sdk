import { IUnitId } from '../../IUnitId.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Transfer non-fungible token attributes array.
 */
export type TransferNonFungibleTokenAttributesArray = readonly [
  Uint8Array, // Type ID
  Uint8Array, // Owner Predicate
  bigint, // Counter
];

/**
 * Transfer non-fungible token payload attributes.
 */
export class TransferNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer non-fungible token attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} counter - Counter.
   * @param {IUnitId} typeId - Type ID.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
    public readonly typeId: IUnitId,
  ) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferNonFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Counter: ${this.counter}
        Type ID: ${this.typeId.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<TransferNonFungibleTokenAttributesArray> {
    return Promise.resolve([this.typeId.bytes, this.ownerPredicate.bytes, this.counter]);
  }

  /**
   * Create a TransferNonFungibleTokenAttributes from array.
   * @param {TransferNonFungibleTokenAttributesArray} data - transfer non-fungible token attributes array.
   * @returns {TransferNonFungibleTokenAttributes} Transfer non-fungible token attributes instance.
   */
  public static fromArray([
    typeId,
    ownerPredicate,
    counter,
  ]: TransferNonFungibleTokenAttributesArray): TransferNonFungibleTokenAttributes {
    return new TransferNonFungibleTokenAttributes(
      new PredicateBytes(ownerPredicate),
      counter,
      UnitId.fromBytes(typeId),
    );
  }
}
