import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransferBillToDustCollectorPayload } from './TransferBillDustCollectorPayload.js';

export type SwapBillsWithDustCollectorAttributesArray = readonly [
  Uint8Array,
  TransactionRecordArray[],
  TransactionProofArray[],
  bigint,
];

export class SwapBillsWithDustCollectorAttributes implements ITransactionPayloadAttributes {
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
}
