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
    private readonly ownerPredicate: IPredicate,
    private readonly targetValue: bigint,
    private readonly nonce: Uint8Array | null,
    private readonly backlink: Uint8Array,
    private readonly typeId: IUnitId,
    private readonly remainingValue: bigint,
    private readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this.nonce = this.nonce ? new Uint8Array(this.nonce) : null;
    this.backlink = new Uint8Array(this.backlink);
    this.remainingValue = BigInt(this.remainingValue);
    this.invariantPredicateSignatures =
      this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public getOwnerPredicate(): IPredicate {
    return this.ownerPredicate;
  }

  public getTargetValue(): bigint {
    return this.targetValue;
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

  public getRemainingValue(): bigint {
    return this.remainingValue;
  }

  public getInvariantPredicateSignatures(): Uint8Array[] | null {
    return this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): SplitFungibleTokenAttributesArray {
    return [
      this.getOwnerPredicate().getBytes(),
      this.getTargetValue(),
      this.getNonce(),
      this.getBacklink(),
      this.getTypeId().getBytes(),
      this.getRemainingValue(),
      null,
    ];
  }

  public toArray(): SplitFungibleTokenAttributesArray {
    return [
      this.getOwnerPredicate().getBytes(),
      this.getTargetValue(),
      this.getNonce(),
      this.getBacklink(),
      this.getTypeId().getBytes(),
      this.getRemainingValue(),
      this.getInvariantPredicateSignatures(),
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
        Invariant Predicate Signatures: ${
          this.invariantPredicateSignatures
            ? dedent`
        [
          ${this.invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: SplitFungibleTokenAttributesArray): SplitFungibleTokenAttributes {
    return new SplitFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      data[1],
      data[2],
      data[3],
      UnitId.fromBytes(data[4]),
      data[5],
      data[6],
    );
  }
}
