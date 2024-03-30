import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type SplitFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  bigint,
  Uint8Array[] | null,
];

export class SplitFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    public readonly nonce: Uint8Array | null,
    public readonly backlink: Uint8Array,
    public readonly typeId: IUnitId,
    public readonly remainingValue: bigint,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): SplitFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.getBytes(),
      this.targetValue,
      this.nonce,
      this.backlink,
      this.typeId.getBytes(),
      this.remainingValue,
      null,
    ];
  }

  public toArray(): SplitFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.getBytes(),
      this.targetValue,
      this.nonce,
      this.backlink,
      this.typeId.getBytes(),
      this.remainingValue,
      this.invariantPredicateSignatures,
    ];
  }

  public toString(): string {
    return dedent`
      SplitFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Target Value: ${this.targetValue}
        Nonce: ${this.nonce ? Base16Converter.encode(this.nonce) : 'null'}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Type ID: ${this.typeId.toString()}
        Remaining Value: ${this.remainingValue}
        Invariant Predicate Signatures: [
          ${this.invariantPredicateSignatures?.map((signature) => Base16Converter.encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }
}
