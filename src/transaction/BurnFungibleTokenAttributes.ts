import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type BurnFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

export class BurnFungibleTokenAttributes implements ITransactionPayloadAttributes {
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
}
