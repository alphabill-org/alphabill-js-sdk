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
  bigint | null,
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
    private readonly ownerPredicate: IPredicate,
    private readonly value: bigint,
    private readonly nonce: bigint | null,
    private readonly backlink: Uint8Array,
    private readonly typeId: IUnitId,
    private readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this.nonce = this.nonce ? BigInt(this.nonce) : null;
    this.backlink = new Uint8Array(this.backlink);
    this.invariantPredicateSignatures =
      this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public getOwnerPredicate(): IPredicate {
    return this.ownerPredicate;
  }

  public getValue(): bigint {
    return this.value;
  }

  public getNonce(): bigint | null {
    return this.nonce;
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

  public toOwnerProofData(): TransferFungibleTokenAttributesArray {
    return [
      this.getOwnerPredicate().getBytes(),
      this.getValue(),
      this.getNonce(),
      this.getBacklink(),
      this.getTypeId().getBytes(),
      null,
    ];
  }

  public toArray(): TransferFungibleTokenAttributesArray {
    return [
      this.getOwnerPredicate().getBytes(),
      this.getValue(),
      this.getNonce(),
      this.getBacklink(),
      this.getTypeId().getBytes(),
      this.getInvariantPredicateSignatures(),
    ];
  }

  public toString(): string {
    return dedent`
      TransferFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Value: ${this.value}
        Nonce: ${this.nonce}
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

  public static fromArray(data: TransferFungibleTokenAttributesArray): TransferFungibleTokenAttributes {
    return new TransferFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      data[1],
      data[2],
      data[3],
      UnitId.fromBytes(data[4]),
      data[5],
    );
  }
}
