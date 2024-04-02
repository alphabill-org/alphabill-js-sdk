import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type TransferFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  bigint,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

@PayloadAttribute
export class TransferFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'transFToken';
  }

  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly value: bigint,
    public readonly nonce: bigint,
    public readonly backlink: Uint8Array,
    public readonly typeId: IUnitId,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): TransferFungibleTokenAttributesArray {
    return [this.ownerPredicate.getBytes(), this.value, this.nonce, this.backlink, this.typeId.getBytes(), null];
  }

  public toArray(): TransferFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.getBytes(),
      this.value,
      this.nonce,
      this.backlink,
      this.typeId.getBytes(),
      this.invariantPredicateSignatures,
    ];
  }

  public toString(): string {
    return dedent`
      TransferFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Value: ${this.value}
        Nonce: ${this.nonce}
        Backlink: ${Base16Converter.Encode(this.backlink)}
        Type ID: ${this.typeId.toString()}
        Invariant Predicate Signatures: [
          ${this.invariantPredicateSignatures?.map((signature) => Base16Converter.Encode(signature)).join(',\n') ?? 'null'}
        ]`;
  }

  public static FromArray(data: TransferFungibleTokenAttributesArray): TransferFungibleTokenAttributes {
    return new TransferFungibleTokenAttributes(
      new PredicateBytes(new Uint8Array(data[0])),
      BigInt(data[1]),
      BigInt(data[2]),
      new Uint8Array(data[3]),
      UnitId.FromBytes(new Uint8Array(data[4])),
      data[5]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
