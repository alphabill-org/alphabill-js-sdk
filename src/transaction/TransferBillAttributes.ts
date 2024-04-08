import { PredicateBytes } from '../PredicateBytes.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type TransferBillAttributesArray = [Uint8Array, bigint, Uint8Array];

const PAYLOAD_TYPE = 'trans';

@PayloadAttribute(PAYLOAD_TYPE)
export class TransferBillAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    private readonly _backlink: Uint8Array,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): TransferBillAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferBillAttributesArray {
    return [this.ownerPredicate.bytes, this.targetValue, this.backlink];
  }

  public toString(): string {
    return dedent`
      TransferBillAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Target Value: ${this.targetValue}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  public static fromArray(data: TransferBillAttributesArray): TransferBillAttributes {
    return new TransferBillAttributes(new PredicateBytes(data[0]), data[1], data[2]);
  }
}
