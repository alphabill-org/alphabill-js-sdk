import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type UnlockBillAttributesArray = readonly [Uint8Array];

@PayloadAttribute
export class UnlockBillAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'unlock';
  }

  public constructor(public readonly backlink: Uint8Array) {
    this.backlink = new Uint8Array(this.backlink);
  }

  public toOwnerProofData(): UnlockBillAttributesArray {
    return this.toArray();
  }

  public toArray(): UnlockBillAttributesArray {
    return [new Uint8Array(this.backlink)];
  }

  public toString(): string {
    return dedent`
      UnlockBillAttributes
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }

  public static fromArray(data: UnlockBillAttributesArray): UnlockBillAttributes {
    return new UnlockBillAttributes(data[0]);
  }
}
