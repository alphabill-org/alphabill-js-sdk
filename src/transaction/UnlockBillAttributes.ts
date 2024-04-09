import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type UnlockBillAttributesArray = readonly [Uint8Array];

export class UnlockBillAttributes implements ITransactionPayloadAttributes {
  public constructor(private readonly _backlink: Uint8Array) {
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): PayloadType {
    return PayloadType.UnlockBillAttributes;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): UnlockBillAttributesArray {
    return this.toArray();
  }

  public toArray(): UnlockBillAttributesArray {
    return [this.backlink];
  }

  public toString(): string {
    return dedent`
      UnlockBillAttributes
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  public static fromArray(data: UnlockBillAttributesArray): UnlockBillAttributes {
    return new UnlockBillAttributes(data[0]);
  }
}
