import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type TransferFungibleTokenAttributesArray = readonly [
  Uint8Array,
  bigint,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
];

export class TransferFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly value: bigint,
    private readonly _nonce: Uint8Array | null,
    private readonly _backlink: Uint8Array,
    public readonly typeId: IUnitId,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this._nonce = this._nonce ? new Uint8Array(this._nonce) : null;
    this._backlink = new Uint8Array(this._backlink);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public get payloadType(): PayloadType {
    return PayloadType.TransferFungibleTokenAttributes;
  }

  public get nonce(): Uint8Array | null {
    return this._nonce ? new Uint8Array(this._nonce) : null;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public get invariantPredicateSignatures(): Uint8Array[] | null {
    return this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): TransferFungibleTokenAttributesArray {
    return [this.ownerPredicate.bytes, this.value, this.nonce, this.backlink, this.typeId.bytes, null];
  }

  public toArray(): TransferFungibleTokenAttributesArray {
    return [
      this.ownerPredicate.bytes,
      this.value,
      this.nonce,
      this.backlink,
      this.typeId.bytes,
      this.invariantPredicateSignatures,
    ];
  }

  public toString(): string {
    return dedent`
      TransferFungibleTokenAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Value: ${this.value}
        Nonce: ${this._nonce}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Type ID: ${this.typeId.toString()}
        Invariant Predicate Signatures: ${
          this._invariantPredicateSignatures
            ? dedent`
        [
          ${this._invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
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
