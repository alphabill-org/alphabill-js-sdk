import { IUnitId } from '../../IUnitId.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

import { TransactionOrderType } from '../TransactionOrderType';

/**
 * Transfer fungible token attributes array.
 */
export type TransferFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array | null,
  bigint,
  Uint8Array,
  Uint8Array[] | null,
];

/**
 * Transfer fungible token payload attributes.
 */
export class TransferFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer fungible token attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} value - Value.
   * @param {Uint8Array | null} _nonce - Nonce.
   * @param {bigint} counter - Counter.
   * @param {IUnitId} typeId - Type ID.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures - Invariant predicate signatures.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly value: bigint,
    private readonly _nonce: Uint8Array | null,
    public readonly counter: bigint,
    public readonly typeId: IUnitId,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this._nonce = this._nonce ? new Uint8Array(this._nonce) : null;
    this.counter = BigInt(this.counter);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): TransactionOrderType {
    return TransactionOrderType.TransferFungibleToken;
  }

  /**
   * Get nonce.
   * @returns {Uint8Array | null} Nonce.
   */
  public get nonce(): Uint8Array | null {
    return this._nonce ? new Uint8Array(this._nonce) : null;
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
  public toOwnerProofData(): TransferFungibleTokenAttributesArray {
    return [this.ownerPredicate.bytes, this.value, this.nonce, this.counter, this.typeId.bytes, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): TransferFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.bytes,
      this.value,
      this.nonce,
      this.counter,
      this.typeId.bytes,
      this.invariantPredicateSignatures,
    ];
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
        Nonce: ${this._nonce}
        Counter: ${this.counter}
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
   * Create TransferFungibleTokenAttributesArray from array.
   * @param {TransferFungibleTokenAttributesArray} data - Transfer fungible token attributes array.
   * @returns {TransferFungibleTokenAttributes} Transfer fungible token attributes instance.
   */
  public static fromArray(data: TransferFungibleTokenAttributesArray): TransferFungibleTokenAttributes {
    return new TransferFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      data[1],
      data[2],
      data[3],
      UnitId.fromBytes(data[4]),
      data[5],
    );
  }
}
