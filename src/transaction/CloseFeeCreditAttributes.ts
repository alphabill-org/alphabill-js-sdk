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
  ) {}

  public toOwnerProofData(): CloseFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): CloseFeeCreditAttributesArray {
    return [this.amount, this.targetUnitId.getBytes(), this.targetUnitBacklink];
  }

  public toString(): string {
    return dedent`
      CloseFeeCreditAttributes
        Amount: ${this.amount}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Backlink: ${Base16Converter.Encode(this.targetUnitBacklink)}`;
  }

  public static FromArray(data: CloseFeeCreditAttributesArray): CloseFeeCreditAttributes {
    return new CloseFeeCreditAttributes(
      BigInt(data[0]),
      UnitId.FromBytes(new Uint8Array(data[1])),
      new Uint8Array(data[2]),
    );
  }
}
