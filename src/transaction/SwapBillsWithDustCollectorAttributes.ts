import { PredicateBytes } from '../PredicateBytes.js';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { TransferBillToDustCollectorPayload } from './TransferBillDustCollectorPayload.js';

export type SwapBillsWithDustCollectorAttributesArray = readonly [
  Uint8Array,
  TransactionRecordArray[],
  TransactionProofArray[],
  bigint,
];

@PayloadAttribute
export class SwapBillsWithDustCollectorAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'swapDC';
  }

  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly proofs: ReadonlyArray<TransactionRecordWithProof<TransferBillToDustCollectorPayload>>,
    public readonly targetValue: bigint,
  ) {}

  public toOwnerProofData(): SwapBillsWithDustCollectorAttributesArray {
    return this.toArray();
  }

  public toArray(): SwapBillsWithDustCollectorAttributesArray {
    return [
      this.ownerPredicate.getBytes(),
      this.proofs.map((proof) => proof.transactionRecord.toArray()),
      this.proofs.map((proof) => proof.transactionProof.toArray()),
      this.targetValue,
    ];
  }

  public toString(): string {
    return dedent`
      SwapBillsWithDustCollectorAttributes
          Owner Predicate: ${this.ownerPredicate.toString()}
          Proofs: [
            ${this.proofs.map((proof) => proof.toString()).join('\n')}
          ]
          Target Value: ${this.targetValue}
      `;
  }

  public static FromArray(data: SwapBillsWithDustCollectorAttributesArray): SwapBillsWithDustCollectorAttributes {
    const proofs = Array<TransactionRecordWithProof<TransferBillToDustCollectorPayload>>();

    for (let i = 0; i < data[1].length; i++) {
      proofs.push(TransactionRecordWithProof.FromArray([data[1][i], data[2][i]]));
    }

    return new SwapBillsWithDustCollectorAttributes(
      new PredicateBytes(new Uint8Array(data[0])),
      proofs,
      BigInt(data[3]),
    );
  }
}
