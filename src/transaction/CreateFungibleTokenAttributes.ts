import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Create fungible token attributes array.
 */
export type CreateFungibleTokenAttributesArray = readonly [
  Uint8Array,
  Uint8Array,
  bigint,
  bigint,
  Uint8Array[] | null,
];

/**
 * Create fungible token payload attributes.
 */
export class CreateFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Create fungible token payload attributes constructor.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IUnitId} typeId Token type ID.
   * @param {bigint} value Token value.
   * @param {bigint} nonce Optional nonce.
   * @param {Uint8Array[] | null} _tokenCreationPredicateSignatures Token creation predicate signatures.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly nonce: bigint,
    private readonly _tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this.nonce = BigInt(this.nonce);
    this._tokenCreationPredicateSignatures =
      this._tokenCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.CreateFungibleTokenAttributes;
  }

  /**
   * Get token creation predicate signatures.
   * @returns {Uint8Array[] | null}
   */
  public get tokenCreationPredicateSignatures(): Uint8Array[] | null {
    return this._tokenCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): CreateFungibleTokenAttributesArray {
    return [this.ownerPredicate.bytes, this.typeId.bytes, this.value, this.nonce, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): CreateFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.bytes,
      this.typeId.bytes,
      this.value,
      this.nonce,
      this.tokenCreationPredicateSignatures,
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      CreateFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Nonce: ${this.nonce}
        Token Creation Predicate Signatures: ${
          this._tokenCreationPredicateSignatures
            ? dedent`
        [
          ${this._tokenCreationPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  /**
   * Create CreateFungibleTokenAttributes from array.
   * @param {CreateFungibleTokenAttributesArray} data Create fungible token attributes array.
   * @returns {CreateFungibleTokenAttributes} Create fungible token attributes instance.
   */
  public static fromArray(data: CreateFungibleTokenAttributesArray): CreateFungibleTokenAttributes {
    return new CreateFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      UnitId.fromBytes(data[1]),
      data[2],
      data[3],
      data[4],
    );
  }
}
