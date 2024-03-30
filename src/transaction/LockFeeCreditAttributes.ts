import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type LockFeeCreditAttributesArray = readonly [bigint, Uint8Array];

export class LockFeeCreditAttributes implements ITransactionPayloadAttributes {
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
}
