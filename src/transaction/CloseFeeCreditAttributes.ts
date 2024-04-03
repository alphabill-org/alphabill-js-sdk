import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type CloseFeeCreditAttributesArray = readonly [bigint, Uint8Array, Uint8Array];

@PayloadAttribute
export class CloseFeeCreditAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'closeFC';
  }

  public constructor(
    public readonly amount: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitBacklink: Uint8Array,
  ) {
    this.amount = BigInt(this.amount);
    this.targetUnitBacklink = new Uint8Array(this.targetUnitBacklink);
  }

  public toOwnerProofData(): CloseFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): CloseFeeCreditAttributesArray {
    return [this.amount, this.targetUnitId.getBytes(), new Uint8Array(this.targetUnitBacklink)];
  }

  public toString(): string {
    return dedent`
      CloseFeeCreditAttributes
        Amount: ${this.amount}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Backlink: ${Base16Converter.encode(this.targetUnitBacklink)}`;
  }

  public static fromArray(data: CloseFeeCreditAttributesArray): CloseFeeCreditAttributes {
    return new CloseFeeCreditAttributes(data[0], UnitId.fromBytes(data[1]), data[2]);
  }
}
