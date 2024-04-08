import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { TokenIcon, TokenIconArray } from './TokenIcon.js';

export type CreateNonFungibleTokenTypeAttributesArray = readonly [
  string,
  string,
  TokenIconArray,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

const PAYLOAD_TYPE = 'createNType';

@PayloadAttribute(PAYLOAD_TYPE)
export class CreateNonFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    private readonly _subTypeCreationPredicateSignatures: Uint8Array[] | null,
  ) {
    this._subTypeCreationPredicateSignatures =
      this._subTypeCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get subTypeCreationPredicateSignatures(): Uint8Array[] | null {
    return this._subTypeCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): CreateNonFungibleTokenTypeAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateNonFungibleTokenTypeAttributesArray {
    return [
      this.symbol,
      this.name,
      this.icon.toArray(),
      this.parentTypeId?.bytes || null,
      this.subTypeCreationPredicate.bytes,
      this.tokenCreationPredicate.bytes,
      this.invariantPredicate.bytes,
      this.dataUpdatePredicate.bytes,
      this.subTypeCreationPredicateSignatures,
    ];
  }

  public toString(): string {
    return dedent`
      CreateNonFungibleTokenTypeAttributes
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Creation Predicate: ${this.tokenCreationPredicate.toString()}
        Invariant Predicate: ${this.invariantPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Sub Type Creation Predicate Signatures: ${
          this._subTypeCreationPredicateSignatures
            ? dedent`
        [
          ${this._subTypeCreationPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: CreateNonFungibleTokenTypeAttributesArray): CreateNonFungibleTokenTypeAttributes {
    return new CreateNonFungibleTokenTypeAttributes(
      data[0],
      data[1],
      TokenIcon.fromArray(data[2]),
      data[3] ? UnitId.fromBytes(data[3]) : null,
      new PredicateBytes(data[4]),
      new PredicateBytes(data[5]),
      new PredicateBytes(data[6]),
      new PredicateBytes(data[7]),
      data[8],
    );
  }
}
