import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type UnlockFeeCreditAttributesArray = readonly [Uint8Array];

@PayloadAttribute
export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'unlockFC';
  }

  public constructor(public readonly backlink: Uint8Array) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.backlink];
  }

  public toString(): string {
    return dedent`
      UnlockFeeCreditAttributes
        Backlink: ${this.backlink}`;
  }

  public static FromArray(data: UnlockFeeCreditAttributesArray): UnlockFeeCreditAttributes {
    return new UnlockFeeCreditAttributes(data[0]);
  }
}
