import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { NonFungibleTokenData } from './NonFungibleTokenData.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type CreateNonFungibleTokenAttributesArray = readonly [
  Uint8Array,
  Uint8Array,
  string,
  string,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

@PayloadAttribute
export class CreateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'createNToken';
  }

  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    public readonly data: INonFungibleTokenData,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): CreateNonFungibleTokenAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateNonFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.getBytes(),
      this.typeId.getBytes(),
      this.name,
      this.uri,
      this.data.getBytes(),
      this.dataUpdatePredicate.getBytes(),
      this.tokenCreationPredicateSignatures,
    ];
  }

  public toString(): string {
    return dedent`
      CreateNonFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Type ID: ${this.typeId.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${this.data.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Token Creation Predicate Signatures: ${
          this.tokenCreationPredicateSignatures
            ? dedent`
        [
          ${this.tokenCreationPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: CreateNonFungibleTokenAttributesArray): CreateNonFungibleTokenAttributes {
    return new CreateNonFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      UnitId.fromBytes(data[1]),
      data[2],
      data[3],
      NonFungibleTokenData.createFromBytes(data[4]),
      new PredicateBytes(data[5]),
      data[6] || null,
    );
  }
}
