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

@PayloadAttribute
export class CreateNonFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'createNType';
  }

  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly subTypeCreationPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): CreateNonFungibleTokenTypeAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateNonFungibleTokenTypeAttributesArray {
    return [
      this.symbol,
      this.name,
      this.icon.toArray(),
      this.parentTypeId?.getBytes() || null,
      this.subTypeCreationPredicate.getBytes(),
      this.tokenCreationPredicate.getBytes(),
      this.invariantPredicate.getBytes(),
      this.dataUpdatePredicate.getBytes(),
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
        Sub Type Creation Predicate Signatures: [
          ${this.subTypeCreationPredicateSignatures?.map((signature) => Base16Converter.encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }

  public static fromArray(data: CreateNonFungibleTokenTypeAttributesArray): CreateNonFungibleTokenTypeAttributes {
    return new CreateNonFungibleTokenTypeAttributes(
      data[0],
      data[1],
      TokenIcon.fromArray(data[2]),
      data[3] ? UnitId.fromBytes(new Uint8Array(data[3])) : null,
      new PredicateBytes(new Uint8Array(data[4])),
      new PredicateBytes(new Uint8Array(data[5])),
      new PredicateBytes(new Uint8Array(data[6])),
      new PredicateBytes(new Uint8Array(data[7])),
      data[8]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
