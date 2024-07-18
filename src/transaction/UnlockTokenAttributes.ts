import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Unlock token attributes array.
 */
export type UnlockTokenAttributesArray = readonly [bigint, Uint8Array[] | null];

/**
 * Unlock token payload attributes.
 */
export class UnlockTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock token attributes constructor.
   * @param {bigint} counter - Counter.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures Invariant predicate signatures.
   */
  public constructor(
    public readonly counter: bigint,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.counter = BigInt(this.counter);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.UnlockTokenAttributes;
  }

  /**
   * Get invariant predicate signatures.
   * @returns {Uint8Array[] | null} Invariant predicate signatures.
   */
  public get invariantPredicateSignatures(): Uint8Array[] | null {
    return this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): UnlockTokenAttributesArray {
    return [this.counter, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): UnlockTokenAttributesArray {
    return [this.counter, this.invariantPredicateSignatures];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockTokenAttributes
        Counter: ${this.counter}
        Invariant Predicate Signatures: ${
          this._invariantPredicateSignatures
            ? dedent`
        [
          ${this._invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  /**
   * Create UnlockTokenAttributes from array.
   * @param {UnlockTokenAttributesArray} data Unlock token attributes array.
   * @returns {UnlockTokenAttributes} Unlock token attributes instance.
   */
  public static fromArray(data: UnlockTokenAttributesArray): UnlockTokenAttributes {
    return new UnlockTokenAttributes(data[0], data[1]);
  }
}
