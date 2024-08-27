import { IUnitId } from '../../IUnitId.js';
import { UnitId } from '../../UnitId.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { PayloadType } from '../PayloadAttributeFactory.js';

/**
 * Burn fungible token attributes array.
 */
export type BurnFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array,
  bigint,
  bigint,
  Uint8Array[] | null,
];

/**
 * Burn fungible token payload attributes.
 */
export class BurnFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Burn fungible token payload attributes constructor.
   * @param {IUnitId} typeId Token type ID.
   * @param {bigint} value Token value.
   * @param {IUnitId} targetTokenId Target token ID.
   * @param {bigint} targetTokenCounter Target token counter.
   * @param {bigint} counter Counter.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures Invariant predicate signatures.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly targetTokenId: IUnitId,
    public readonly targetTokenCounter: bigint,
    public readonly counter: bigint,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this.targetTokenCounter = BigInt(this.targetTokenCounter);
    this.counter = BigInt(this.counter);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.BurnFungibleTokenAttributes;
  }

  /**
   * Get invariant predicate signatures.
   * @returns {Uint8Array[] | null}
   */
  public get invariantPredicateSignatures(): Uint8Array[] | null {
    return this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): BurnFungibleTokenAttributesArray {
    return [this.typeId.bytes, this.value, this.targetTokenId.bytes, this.targetTokenCounter, this.counter, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): BurnFungibleTokenAttributesArray {
    return [
      this.typeId.bytes,
      this.value,
      this.targetTokenId.bytes,
      this.targetTokenCounter,
      this.counter,
      this.invariantPredicateSignatures,
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      BurnFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Target Token ID: ${this.targetTokenId.toString()}
        Target Token Counter: ${this.targetTokenCounter}
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
   * Create BurnFungibleTokenAttributes from array.
   * @param {BurnFungibleTokenAttributesArray} data Burn fungible token attributes array.
   * @returns {BurnFungibleTokenAttributes} Burn fungible token attributes.
   */
  public static fromArray(data: BurnFungibleTokenAttributesArray): BurnFungibleTokenAttributes {
    return new BurnFungibleTokenAttributes(
      UnitId.fromBytes(data[0]),
      data[1],
      UnitId.fromBytes(data[2]),
      data[3],
      data[4],
      data[5],
    );
  }
}
