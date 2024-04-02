import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type LockBillAttributesArray = readonly [bigint, Uint8Array];

@PayloadAttribute
export class LockBillAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'lock';
  }

  public constructor(
    public readonly lockStatus: bigint,
    public readonly backlink: Uint8Array,
  ) {}

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
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }

  public static fromArray(data: LockBillAttributesArray): LockBillAttributes {
    return new LockBillAttributes(data[0], data[1]);
  }
}
