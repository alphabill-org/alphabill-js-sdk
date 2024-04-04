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
    private readonly symbol: string,
    private readonly name: string,
    private readonly icon: TokenIcon,
    private readonly parentTypeId: IUnitId | null,
    private readonly subTypeCreationPredicate: IPredicate,
    private readonly tokenCreationPredicate: IPredicate,
    private readonly invariantPredicate: IPredicate,
    private readonly dataUpdatePredicate: IPredicate,
    private readonly subTypeCreationPredicateSignatures: Uint8Array[] | null,
  ) {
    this.subTypeCreationPredicateSignatures =
      this.subTypeCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public getSymbol(): string {
    return this.symbol;
  }

  public getName(): string {
    return this.name;
  }

  public getIcon(): TokenIcon {
    return this.icon;
  }

  public getParentTypeId(): IUnitId | null {
    return this.parentTypeId;
  }

  public getSubTypeCreationPredicate(): IPredicate {
    return this.subTypeCreationPredicate;
  }

  public getTokenCreationPredicate(): IPredicate {
    return this.tokenCreationPredicate;
  }

  public getInvariantPredicate(): IPredicate {
    return this.invariantPredicate;
  }

  public getDataUpdatePredicate(): IPredicate {
    return this.dataUpdatePredicate;
  }

  public getSubTypeCreationPredicateSignatures(): Uint8Array[] | null {
    return this.subTypeCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): CreateNonFungibleTokenTypeAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateNonFungibleTokenTypeAttributesArray {
    return [
      this.getSymbol(),
      this.getName(),
      this.getIcon().toArray(),
      this.getParentTypeId()?.getBytes() || null,
      this.getSubTypeCreationPredicate().getBytes(),
      this.getTokenCreationPredicate().getBytes(),
      this.getInvariantPredicate().getBytes(),
      this.getDataUpdatePredicate().getBytes(),
      this.getSubTypeCreationPredicateSignatures(),
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
          this.subTypeCreationPredicateSignatures
            ? dedent`
        [
          ${this.subTypeCreationPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
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
