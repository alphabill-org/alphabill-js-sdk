import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type LockFeeCreditAttributesArray = readonly [bigint, Uint8Array];

export class LockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly lockStatus: bigint,
    private readonly _backlink: Uint8Array,
  ) {
    this.lockStatus = BigInt(this.lockStatus);
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): PayloadType {
    return PayloadType.LockFeeCreditAttributes;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

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
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  public static fromArray(data: LockFeeCreditAttributesArray): LockFeeCreditAttributes {
    return new LockFeeCreditAttributes(data[0], data[1]);
  }
}
