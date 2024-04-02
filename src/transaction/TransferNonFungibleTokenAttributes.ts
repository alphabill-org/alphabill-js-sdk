import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type TransferNonFungibleTokenAttributesArray = readonly [
  Uint8Array,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

@PayloadAttribute
export class TransferNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'transNToken';
  }

  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly nonce: Uint8Array | null,
    public readonly backlink: Uint8Array,
    public readonly typeId: IUnitId,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): TransferNonFungibleTokenAttributesArray {
    return [this.ownerPredicate.getBytes(), this.nonce, this.backlink, this.typeId.getBytes(), null];
  }

  public toArray(): TransferNonFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.getBytes(),
      this.nonce,
      this.backlink,
      this.typeId.getBytes(),
      this.invariantPredicateSignatures,
    ];
  }

  public toString(): string {
    return dedent`
      TransferNonFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Nonce: ${this.nonce ? Base16Converter.Encode(this.nonce) : 'null'}
        Backlink: ${Base16Converter.Encode(this.backlink)}
        Type ID: ${this.typeId.toString()}
        Invariant Predicate Signatures: [
          ${this.invariantPredicateSignatures?.map((signature) => Base16Converter.Encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }

  public static FromArray(data: TransferNonFungibleTokenAttributesArray): TransferNonFungibleTokenAttributes {
    return new TransferNonFungibleTokenAttributes(
      new PredicateBytes(new Uint8Array(data[0])),
      data[1] ? new Uint8Array(data[1]) : null,
      new Uint8Array(data[2]),
      UnitId.FromBytes(new Uint8Array(data[3])),
      data[4]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
