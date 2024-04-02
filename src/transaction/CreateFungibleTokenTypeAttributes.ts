import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { TokenIcon, TokenIconArray } from './TokenIcon.js';

export type CreateFungibleTokenTypeAttributesArray = readonly [
  string,
  string,
  TokenIconArray,
  Uint8Array | null,
  number,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

@PayloadAttribute
export class CreateFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'createFType';
  }

  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly decimalPlaces: number,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly subTypeCreationPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): CreateFungibleTokenTypeAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateFungibleTokenTypeAttributesArray {
    return [
      this.symbol,
      this.name,
      this.icon.toArray(),
      this.parentTypeId?.getBytes() || null,
      this.decimalPlaces,
      this.subTypeCreationPredicate.getBytes(),
      this.tokenCreationPredicate.getBytes(),
      this.invariantPredicate.getBytes(),
      this.subTypeCreationPredicateSignatures,
    ];
  }

  public toString(): string {
    return dedent`
      CreateFungibleTokenTypeAttributes
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Decimal Places: ${this.decimalPlaces}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Creation Predicate: ${this.tokenCreationPredicate.toString()}
        Invariant Predicate: ${this.invariantPredicate.toString()}
        Sub Type Creation Predicate Signatures: [
          ${this.subTypeCreationPredicateSignatures?.map((signature) => Base16Converter.Encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }

  public static FromArray(data: CreateFungibleTokenTypeAttributesArray): CreateFungibleTokenTypeAttributes {
    return new CreateFungibleTokenTypeAttributes(
      data[0],
      data[1],
      TokenIcon.FromArray(data[2]),
      data[3] ? UnitId.FromBytes(new Uint8Array(data[3])) : null,
      data[4],
      new PredicateBytes(new Uint8Array(data[5])),
      new PredicateBytes(new Uint8Array(data[6])),
      new PredicateBytes(new Uint8Array(data[7])),
      data[8]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
