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
    private readonly ownerPredicate: IPredicate,
    private readonly typeId: IUnitId,
    private readonly value: bigint,
    private readonly tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this.tokenCreationPredicateSignatures =
      this.tokenCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public getOwnerPredicate(): IPredicate {
    return this.ownerPredicate;
  }

  public getTypeId(): IUnitId {
    return this.typeId;
  }

  public getValue(): bigint {
    return this.value;
  }

  public getTokenCreationPredicateSignatures(): Uint8Array[] | null {
    return this.tokenCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): CreateFungibleTokenAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateFungibleTokenAttributesArray {
    return [
      this.getOwnerPredicate().getBytes(),
      this.getTypeId().getBytes(),
      this.getValue(),
      this.getTokenCreationPredicateSignatures(),
    ];
  }

  public toString(): string {
    return dedent`
      CreateFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Token Creation Predicate Signatures: ${
          this.tokenCreationPredicateSignatures
            ? dedent`
        [
          ${this.tokenCreationPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: CreateFungibleTokenAttributesArray): CreateFungibleTokenAttributes {
    return new CreateFungibleTokenAttributes(new PredicateBytes(data[0]), UnitId.fromBytes(data[1]), data[2], data[3]);
  }
}
