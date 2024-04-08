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

const PAYLOAD_TYPE = 'burnFToken';

@PayloadAttribute(PAYLOAD_TYPE)
export class BurnFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly targetTokenId: IUnitId,
    private readonly _targetTokenBacklink: Uint8Array,
    private readonly _backlink: Uint8Array,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.value = BigInt(this.value);
    this._targetTokenBacklink = new Uint8Array(this._targetTokenBacklink);
    this._backlink = new Uint8Array(this._backlink);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get targetTokenBacklink(): Uint8Array {
    return new Uint8Array(this._targetTokenBacklink);
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public get invariantPredicateSignatures(): Uint8Array[] | null {
    return this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): BurnFungibleTokenAttributesArray {
    return [this.typeId.bytes, this.value, this.targetTokenId.bytes, this.targetTokenBacklink, this.backlink, null];
  }

  public toArray(): BurnFungibleTokenAttributesArray {
    return [
      this.typeId.bytes,
      this.value,
      this.targetTokenId.bytes,
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
        Target Token Backlink: ${Base16Converter.encode(this._targetTokenBacklink)}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Invariant Predicate Signatures: ${
          this._invariantPredicateSignatures
            ? dedent`
        [
          ${this._invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
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
