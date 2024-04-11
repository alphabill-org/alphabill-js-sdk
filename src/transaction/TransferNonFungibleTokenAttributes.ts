import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Transfer non-fungible token attributes array.
 */
export type TransferNonFungibleTokenAttributesArray = readonly [
  Uint8Array,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

/**
 * Transfer non-fungible token payload attributes.
 */
export class TransferNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer non-fungible token attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {Uint8Array | null} _nonce - Nonce.
   * @param {Uint8Array} _backlink - Backlink.
   * @param {IUnitId} typeId - Type ID.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures - Invariant predicate signatures.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    private readonly _nonce: Uint8Array | null,
    private readonly _backlink: Uint8Array,
    public readonly typeId: IUnitId,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this._nonce = this._nonce ? new Uint8Array(this._nonce) : null;
    this._backlink = new Uint8Array(this._backlink);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.TransferNonFungibleTokenAttributes;
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
  public toOwnerProofData(): TransferNonFungibleTokenAttributesArray {
    return [this.ownerPredicate.bytes, this.nonce, this.backlink, this.typeId.bytes, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): TransferNonFungibleTokenAttributesArray {
    return [this.ownerPredicate.bytes, this.nonce, this.backlink, this.typeId.bytes, this.invariantPredicateSignatures];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferNonFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Nonce: ${this._nonce ? Base16Converter.encode(this._nonce) : 'null'}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Type ID: ${this.typeId.toString()}
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
   * Create a TransferNonFungibleTokenAttributes from array.
   * @param {TransferNonFungibleTokenAttributesArray} data - transfer non-fungible token attributes array.
   * @returns {TransferNonFungibleTokenAttributes} Transfer non-fungible token attributes instance.
   */
  public static fromArray(data: TransferNonFungibleTokenAttributesArray): TransferNonFungibleTokenAttributes {
    return new TransferNonFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      data[1],
      data[2],
      UnitId.fromBytes(data[3]),
      data[4],
    );
  }
}
