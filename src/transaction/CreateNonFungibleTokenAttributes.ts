import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type CreateNonFungibleTokenAttributesArray = readonly [
  Uint8Array,
  Uint8Array,
  string,
  string,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

export class CreateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
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
        Token Creation Predicate Signatures: [
          ${this.tokenCreationPredicateSignatures?.map((signature) => Base16Converter.encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }
}
