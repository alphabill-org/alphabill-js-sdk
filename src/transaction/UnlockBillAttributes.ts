import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type UnlockBillAttributesArray = readonly [Uint8Array];

export class UnlockBillAttributes implements ITransactionPayloadAttributes {
  public constructor(public readonly backlink: Uint8Array) {}

  public toOwnerProofData(): UnlockBillAttributesArray {
    return this.toArray();
  }

  public toArray(): UnlockBillAttributesArray {
    return [this.backlink];
  }

  public toString(): string {
    return dedent`
      UnlockBillAttributes
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }
}
