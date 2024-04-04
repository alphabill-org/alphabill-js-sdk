import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type UnlockFeeCreditAttributesArray = readonly [Uint8Array];

@PayloadAttribute
export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'unlockFC';
  }

  public constructor(private readonly backlink: Uint8Array) {
    this.backlink = new Uint8Array(this.backlink);
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public toOwnerProofData(): UnlockFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): UnlockFeeCreditAttributesArray {
    return [this.getBacklink()];
  }

  public toString(): string {
    return dedent`
      UnlockFeeCreditAttributes
        Backlink: ${this.backlink}`;
  }

  public static fromArray(data: UnlockFeeCreditAttributesArray): UnlockFeeCreditAttributes {
    return new UnlockFeeCreditAttributes(data[0]);
  }
}
