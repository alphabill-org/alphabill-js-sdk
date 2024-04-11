import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Split fungible token attributes array.
 */
export type SplitFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  bigint,
  Uint8Array[] | null,
];

/**
 * Split fungible token payload attributes.
 */
export class SplitFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Split fungible token attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} targetValue - Target value.
   * @param {Uint8Array | null} _nonce - Nonce.
   * @param {Uint8Array} _backlink - Backlink.
   * @param {IUnitId} typeId - Type ID.
   * @param {bigint} remainingValue - Remaining value.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures - Invariant predicate signatures.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    private readonly _nonce: Uint8Array | null,
    private readonly _backlink: Uint8Array,
    public readonly typeId: IUnitId,
    public readonly remainingValue: bigint,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this._nonce = this._nonce ? new Uint8Array(this._nonce) : null;
    this._backlink = new Uint8Array(this._backlink);
    this.remainingValue = BigInt(this.remainingValue);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.SplitFungibleTokenAttributes;
  }

  /**
   * Get nonce.
   * @returns {Uint8Array | null} Nonce.
   */
  public get nonce(): Uint8Array | null {
    return this._nonce ? new Uint8Array(this._nonce) : null;
  }

  /**
   * Get backlink.
   * @returns {Uint8Array} Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
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
  public toOwnerProofData(): SplitFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.bytes,
      this.targetValue,
      this.nonce,
      this.backlink,
      this.typeId.bytes,
      this.remainingValue,
      null,
    ];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): SplitFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.bytes,
      this.targetValue,
      this.nonce,
      this.backlink,
      this.typeId.bytes,
      this.remainingValue,
      this.invariantPredicateSignatures,
    ];
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
        Nonce: ${this._nonce ? Base16Converter.encode(this._nonce) : 'null'}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Type ID: ${this.typeId.toString()}
        Remaining Value: ${this.remainingValue}
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
   * Create a SplitFungibleTokenAttributes from an array.
   * @param {SplitFungibleTokenAttributesArray} data - Split fungible token attributes array.
   * @returns {SplitFungibleTokenAttributes} Split fungible token attributes instance.
   */
  public static fromArray(data: SplitFungibleTokenAttributesArray): SplitFungibleTokenAttributes {
    return new SplitFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      data[1],
      data[2],
      data[3],
      UnitId.fromBytes(data[4]),
      data[5],
      data[6],
    );
  }
}
