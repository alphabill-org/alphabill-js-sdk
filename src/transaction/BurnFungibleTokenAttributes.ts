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
  ) {}

  public toOwnerProofData(): BurnFungibleTokenAttributesArray {
    return [
      this.typeId.getBytes(),
      this.value,
      this.targetTokenId.getBytes(),
      this.targetTokenBacklink,
      this.backlink,
      null,
    ];
  }

  public toArray(): BurnFungibleTokenAttributesArray {
    return [
      this.typeId.getBytes(),
      this.value,
      this.targetTokenId.getBytes(),
      this.targetTokenBacklink,
      this.backlink,
      this.invariantPredicateSignatures,
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
        Invariant Predicate Signatures: [
          ${this.invariantPredicateSignatures?.map((signature) => Base16Converter.encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }

  public static fromArray(data: BurnFungibleTokenAttributesArray): BurnFungibleTokenAttributes {
    return new BurnFungibleTokenAttributes(
      UnitId.fromBytes(data[0]),
      BigInt(data[1]),
      UnitId.fromBytes(data[2]),
      new Uint8Array(data[3]),
      new Uint8Array(data[4]),
      data[5]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
