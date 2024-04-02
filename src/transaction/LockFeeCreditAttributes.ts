import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type LockFeeCreditAttributesArray = readonly [bigint, Uint8Array];

@PayloadAttribute
export class LockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'lockFC';
  }

  public constructor(
    public readonly lockStatus: bigint,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): LockFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): LockFeeCreditAttributesArray {
    return [this.lockStatus, this.backlink];
  }

  public toString(): string {
    return dedent`
      LockFeeCredit
        Lock Status: ${this.lockStatus}
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }

  public static fromArray(data: LockFeeCreditAttributesArray): LockFeeCreditAttributes {
    return new LockFeeCreditAttributes(data[0], data[1]);
  }
}
