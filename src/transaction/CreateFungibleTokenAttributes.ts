import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type CreateFungibleTokenAttributesArray = readonly [Uint8Array, Uint8Array, bigint, Uint8Array[] | null];

@PayloadAttribute
export class CreateFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'createFToken';
  }

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

  public static fromArray(data: CreateFungibleTokenAttributesArray): CreateFungibleTokenAttributes {
    return new CreateFungibleTokenAttributes(
      new PredicateBytes(new Uint8Array(data[0])),
      UnitId.fromBytes(new Uint8Array(data[1])),
      BigInt(data[2]),
      data[3]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
