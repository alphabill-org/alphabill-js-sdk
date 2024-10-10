import { IUnitId } from '../../IUnitId.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Split fungible token attributes array.
 */
export type SplitFungibleTokenAttributesArray = readonly [
  Uint8Array, // TypeId
  bigint, // TargetValue
  Uint8Array, // Owner predicate
  bigint, // Counter
];

/**
 * Split fungible token payload attributes.
 */
export class SplitFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Split fungible token attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} targetValue - Target value.
   * @param {bigint} counter - Counter.
   * @param {IUnitId} typeId - Type ID.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    public readonly counter: bigint,
    public readonly typeId: IUnitId,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this.counter = BigInt(this.counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      SplitFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Target Value: ${this.targetValue}
        Counter: ${this.counter}
        Type ID: ${this.typeId.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<SplitFungibleTokenAttributesArray> {
    return Promise.resolve([this.typeId.bytes, this.targetValue, this.ownerPredicate.bytes, this.counter]);
  }

  /**
   * Create a SplitFungibleTokenAttributes from an array.
   * @param {SplitFungibleTokenAttributesArray} data - Split fungible token attributes array.
   * @returns {SplitFungibleTokenAttributes} Split fungible token attributes instance.
   */
  public static fromArray([
    typeId,
    targetValue,
    ownerPredicate,
    counter,
  ]: SplitFungibleTokenAttributesArray): SplitFungibleTokenAttributes {
    return new SplitFungibleTokenAttributes(
      new PredicateBytes(ownerPredicate),
      targetValue,
      counter,
      UnitId.fromBytes(typeId),
    );
  }
}
