import { IUnitId } from '../../IUnitId.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { NonFungibleTokenData } from '../NonFungibleTokenData.js';

import { TransactionOrderType } from '../TransactionOrderType';

/**
 * Create non-fungible token attributes array.
 */
export type CreateNonFungibleTokenAttributesArray = readonly [
  Uint8Array,
  Uint8Array,
  string,
  string,
  Uint8Array,
  Uint8Array,
  bigint,
  Uint8Array[] | null,
];

/**
 * Create non-fungible token payload attributes.
 */
export class CreateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Create non-fungible token payload attributes constructor.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IUnitId} typeId Token type ID.
   * @param {string} name Name.
   * @param {string} uri URI.
   * @param {INonFungibleTokenData} data Data.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {bigint} nonce Optional nonce.
   * @param {Uint8Array[] | null} _tokenCreationPredicateSignatures Token creation predicate signatures.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    public readonly data: INonFungibleTokenData,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly nonce: bigint,
    private readonly _tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {
    this.nonce = BigInt(this.nonce);
    this._tokenCreationPredicateSignatures =
      this._tokenCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): TransactionOrderType {
    return TransactionOrderType.CreateNonFungibleToken;
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
  public toOwnerProofData(): CreateNonFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.bytes,
      this.typeId.bytes,
      this.name,
      this.uri,
      this.data.bytes,
      this.dataUpdatePredicate.bytes,
      this.nonce,
      null,
    ];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): CreateNonFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.bytes,
      this.typeId.bytes,
      this.name,
      this.uri,
      this.data.bytes,
      this.dataUpdatePredicate.bytes,
      this.nonce,
      this.tokenCreationPredicateSignatures,
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String.
   */
  public toString(): string {
    return dedent`
      CreateNonFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Type ID: ${this.typeId.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${this.data.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
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
   * Create CreateNonFungibleTokenAttributes from array.
   * @param {CreateNonFungibleTokenAttributesArray} data Create non-fungible token attributes array.
   * @returns {CreateNonFungibleTokenAttributes} Create non-fungible token attributes instance.
   */
  public static fromArray(data: CreateNonFungibleTokenAttributesArray): CreateNonFungibleTokenAttributes {
    return new CreateNonFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      UnitId.fromBytes(data[1]),
      data[2],
      data[3],
      NonFungibleTokenData.createFromBytes(data[4]),
      new PredicateBytes(data[5]),
      data[6],
      data[7],
    );
  }
}
