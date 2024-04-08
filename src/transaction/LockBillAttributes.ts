import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type LockBillAttributesArray = readonly [bigint, Uint8Array];

const PAYLOAD_TYPE = 'lock';

@PayloadAttribute(PAYLOAD_TYPE)
export class LockBillAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly lockStatus: bigint,
    private readonly _backlink: Uint8Array,
  ) {
    this.lockStatus = BigInt(this.lockStatus);
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): LockBillAttributesArray {
    return this.toArray();
  }

  public toArray(): LockBillAttributesArray {
    return [this.lockStatus, this.backlink];
  }

  public toString(): string {
    return dedent`
      LockBillAttributes
        Lock Status: ${this.lockStatus}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  public static fromArray(data: LockBillAttributesArray): LockBillAttributes {
    return new LockBillAttributes(data[0], data[1]);
  }
}
