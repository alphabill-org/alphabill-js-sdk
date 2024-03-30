import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type CreateFungibleTokenAttributesArray = readonly [Uint8Array, Uint8Array, bigint, Uint8Array[] | null];

export class CreateFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): CreateFungibleTokenAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateFungibleTokenAttributesArray {
    return [this.ownerPredicate.getBytes(), this.typeId.getBytes(), this.value, this.tokenCreationPredicateSignatures];
  }

  public toString(): string {
    return dedent`
      CreateFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Token Creation Predicate Signatures: [
          ${this.tokenCreationPredicateSignatures?.map((signature) => Base16Converter.encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }
}
