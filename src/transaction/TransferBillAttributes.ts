import { PredicateBytes } from '../PredicateBytes.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type TransferBillAttributesArray = [Uint8Array, bigint, Uint8Array];

@PayloadAttribute
export class TransferBillAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'trans';
  }

  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): TransferBillAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferBillAttributesArray {
    return [new Uint8Array(this.ownerPredicate.getBytes()), this.targetValue, this.backlink];
  }

  public toString(): string {
    return dedent`
      TransferBillAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Target Value: ${this.targetValue}
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }

  public static fromArray(data: TransferBillAttributesArray): TransferBillAttributes {
    return new TransferBillAttributes(
      new PredicateBytes(new Uint8Array(data[0])),
      BigInt(data[1]),
      new Uint8Array(data[2]),
    );
  }
}
