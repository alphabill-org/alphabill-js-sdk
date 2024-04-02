import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type SplitFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  bigint,
  Uint8Array[] | null,
];

@PayloadAttribute
export class SplitFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'splitFToken';
  }

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
        Nonce: ${this.nonce ? Base16Converter.Encode(this.nonce) : 'null'}
        Backlink: ${Base16Converter.Encode(this.backlink)}
        Type ID: ${this.typeId.toString()}
        Remaining Value: ${this.remainingValue}
        Invariant Predicate Signatures: [
          ${this.invariantPredicateSignatures?.map((signature) => Base16Converter.Encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }

  public static FromArray(data: SplitFungibleTokenAttributesArray): SplitFungibleTokenAttributes {
    return new SplitFungibleTokenAttributes(
      new PredicateBytes(new Uint8Array(data[0])),
      BigInt(data[1]),
      data[2] ? new Uint8Array(data[2]) : null,
      new Uint8Array(data[3]),
      UnitId.FromBytes(new Uint8Array(data[4])),
      BigInt(data[5]),
      data[6]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
