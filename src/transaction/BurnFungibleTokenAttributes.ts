import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type BurnFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array,
  Uint8Array,
  Uint8Array,
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
   * @param {Uint8Array} _targetTokenBacklink Target token backlink.
   * @param {Uint8Array} _backlink Backlink.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures Invariant predicate signatures.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly targetTokenId: IUnitId,
    private readonly _targetTokenBacklink: Uint8Array,
    private readonly _backlink: Uint8Array,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this._targetTokenBacklink = new Uint8Array(this._targetTokenBacklink);
    this._backlink = new Uint8Array(this._backlink);
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
   * Target token backlink.
   * @returns {Uint8Array}
   */
  public get targetTokenBacklink(): Uint8Array {
    return new Uint8Array(this._targetTokenBacklink);
  }

  /**
   * Backlink.
   * @returns {Uint8Array}
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  /**
   * Invariant predicate signatures.
   * @returns {Uint8Array[] | null}
   */
  public get invariantPredicateSignatures(): Uint8Array[] | null {
    return this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): BurnFungibleTokenAttributesArray {
    return [this.typeId.bytes, this.value, this.targetTokenId.bytes, this.targetTokenBacklink, this.backlink, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): BurnFungibleTokenAttributesArray {
    return [
      this.typeId.bytes,
      this.value,
      this.targetTokenId.bytes,
      this.targetTokenBacklink,
      this.backlink,
      this.invariantPredicateSignatures,
    ];
  }

  /**
   * Burn fungible token attributes to string.
   * @returns {string} Burn fungible token attributes to string.
   */
  public toString(): string {
    return dedent`
      BurnFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Target Token ID: ${this.targetTokenId.toString()}
        Target Token Backlink: ${Base16Converter.encode(this._targetTokenBacklink)}
        Backlink: ${Base16Converter.encode(this._backlink)}
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
   * Create burn fungible token attributes from array.
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
