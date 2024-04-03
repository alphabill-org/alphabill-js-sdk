import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type BurnFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

@PayloadAttribute
export class BurnFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'burnFToken';
  }

  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly targetTokenId: IUnitId,
    public readonly targetTokenBacklink: Uint8Array,
    public readonly backlink: Uint8Array,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this.targetTokenBacklink = new Uint8Array(this.targetTokenBacklink);
    this.backlink = new Uint8Array(this.backlink);
    this.invariantPredicateSignatures =
      this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): BurnFungibleTokenAttributesArray {
    return [
      this.typeId.getBytes(),
      this.value,
      this.targetTokenId.getBytes(),
      new Uint8Array(this.targetTokenBacklink),
      new Uint8Array(this.backlink),
      null,
    ];
  }

  public toArray(): BurnFungibleTokenAttributesArray {
    return [
      this.typeId.getBytes(),
      this.value,
      this.targetTokenId.getBytes(),
      new Uint8Array(this.targetTokenBacklink),
      new Uint8Array(this.backlink),
      this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null,
    ];
  }

  public toString(): string {
    return dedent`
      BurnFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Target Token ID: ${this.targetTokenId.toString()}
        Target Token Backlink: ${Base16Converter.encode(this.targetTokenBacklink)}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Invariant Predicate Signatures: ${
          this.invariantPredicateSignatures
            ? dedent`
        [
          ${this.invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: BurnFungibleTokenAttributesArray): BurnFungibleTokenAttributes {
    return new BurnFungibleTokenAttributes(
      UnitId.fromBytes(data[0]),
      data[1],
      UnitId.fromBytes(data[2]),
      data[3],
      data[4],
      data[5],
    );
  }
}
