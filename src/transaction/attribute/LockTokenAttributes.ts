import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

import { TransactionOrderType } from '../TransactionOrderType';

/**
 * Lock token attributes array.
 */
export type LockTokenAttributesArray = readonly [bigint, bigint, Uint8Array[] | null];

/**
 * Lock token payload attributes.
 */
export class LockTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock token attributes constructor.
   * @param {bigint} lockStatus - Lock status.
   * @param {bigint} counter - Counter.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures Invariant predicate signatures.
   */
  public constructor(
    public readonly lockStatus: bigint,
    public readonly counter: bigint,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.lockStatus = BigInt(this.lockStatus);
    this.counter = BigInt(this.counter);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): TransactionOrderType {
    return TransactionOrderType.LockToken;
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
  public toOwnerProofData(): LockTokenAttributesArray {
    return [this.lockStatus, this.counter, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): LockTokenAttributesArray {
    return [this.lockStatus, this.counter, this.invariantPredicateSignatures];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockTokenAttributes
        Lock Status: ${this.lockStatus}
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
   * Create LockTokenAttributes from array.
   * @param {LockTokenAttributesArray} data - Lock token attributes data array.
   * @returns {LockTokenAttributes} Lock token attributes instance.
   */
  public static fromArray(data: LockTokenAttributesArray): LockTokenAttributes {
    return new LockTokenAttributes(data[0], data[1], data[2]);
  }
}
