import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type CreateFungibleTokenAttributesArray = readonly [Uint8Array, Uint8Array, bigint, Uint8Array[] | null];

const PAYLOAD_TYPE = 'createFToken';

@PayloadAttribute(PAYLOAD_TYPE)
export class CreateFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    private readonly _tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this._tokenCreationPredicateSignatures =
      this._tokenCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get tokenCreationPredicateSignatures(): Uint8Array[] | null {
    return this._tokenCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): CreateFungibleTokenAttributesArray {
    return this.toArray();
  }

  public toArray(): CreateFungibleTokenAttributesArray {
    return [this.ownerPredicate.bytes, this.typeId.bytes, this.value, this.tokenCreationPredicateSignatures];
  }

  public toString(): string {
    return dedent`
      CreateFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Token Creation Predicate Signatures: ${
          this._tokenCreationPredicateSignatures
            ? dedent`
        [
          ${this._tokenCreationPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: CreateFungibleTokenAttributesArray): CreateFungibleTokenAttributes {
    return new CreateFungibleTokenAttributes(new PredicateBytes(data[0]), UnitId.fromBytes(data[1]), data[2], data[3]);
  }
}
