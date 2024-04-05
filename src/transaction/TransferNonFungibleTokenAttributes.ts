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
    private readonly ownerPredicate: IPredicate,
    private readonly nonce: Uint8Array | null,
    private readonly backlink: Uint8Array,
    private readonly typeId: IUnitId,
    private readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.nonce = this.nonce ? new Uint8Array(this.nonce) : null;
    this.backlink = new Uint8Array(this.backlink);
    this.invariantPredicateSignatures =
      this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public getOwnerPredicate(): IPredicate {
    return this.ownerPredicate;
  }

  public getNonce(): Uint8Array | null {
    return this.nonce ? new Uint8Array(this.nonce) : null;
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public getTypeId(): IUnitId {
    return this.typeId;
  }

  public getInvariantPredicateSignatures(): Uint8Array[] | null {
    return this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): TransferNonFungibleTokenAttributesArray {
    return [this.ownerPredicate.getBytes(), this.getNonce(), this.getBacklink(), this.typeId.getBytes(), null];
  }

  public toArray(): TransferNonFungibleTokenAttributesArray {
    return [
      this.getOwnerPredicate().getBytes(),
      this.getNonce(),
      this.getBacklink(),
      this.getTypeId().getBytes(),
      this.getInvariantPredicateSignatures(),
    ];
  }

  public toString(): string {
    return dedent`
      TransferNonFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Nonce: ${this.nonce ? Base16Converter.encode(this.nonce) : 'null'}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Type ID: ${this.typeId.toString()}
        Invariant Predicate Signatures: ${
          this.invariantPredicateSignatures
            ? dedent`
        [
          ${this.invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: TransferNonFungibleTokenAttributesArray): TransferNonFungibleTokenAttributes {
    return new TransferNonFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      data[1],
      data[2],
      UnitId.fromBytes(data[3]),
      data[4],
    );
  }
}
