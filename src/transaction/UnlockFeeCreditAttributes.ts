import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type UnlockFeeCreditAttributesArray = readonly [Uint8Array];

export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(private readonly _backlink: Uint8Array) {
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): PayloadType {
    return PayloadType.UnlockFeeCreditAttributes;
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
