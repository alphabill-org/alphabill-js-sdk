import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type UnlockFeeCreditAttributesArray = readonly [Uint8Array];

const PAYLOAD_TYPE = 'unlockFC';

@PayloadAttribute(PAYLOAD_TYPE)
export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(private readonly _backlink: Uint8Array) {
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): UnlockFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): UnlockFeeCreditAttributesArray {
    return [this.backlink];
  }

  public toString(): string {
    return dedent`
      UnlockFeeCreditAttributes
        Backlink: ${this._backlink}`;
  }

  public static fromArray(data: UnlockFeeCreditAttributesArray): UnlockFeeCreditAttributes {
    return new UnlockFeeCreditAttributes(data[0]);
  }
}
