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
    private readonly ownerPredicate: IPredicate,
    private readonly proofs: readonly TransactionRecordWithProof<TransferBillToDustCollectorPayload>[],
    private readonly targetValue: bigint,
  ) {
    this.targetValue = BigInt(this.targetValue);
  }

  public getOwnerPredicate(): IPredicate {
    return this.ownerPredicate;
  }

  public getProofs(): readonly TransactionRecordWithProof<TransferBillToDustCollectorPayload>[] {
    return Array.from(this.proofs);
  }

  public getTargetValue(): bigint {
    return this.targetValue;
  }

  public toOwnerProofData(): SwapBillsWithDustCollectorAttributesArray {
    return this.toArray();
  }

  public toArray(): SwapBillsWithDustCollectorAttributesArray {
    const records: TransactionRecordArray[] = [];
    const proofs: TransactionProofArray[] = [];
    for (const proof of this.getProofs()) {
      records.push(proof.getTransactionRecord().toArray());
      proofs.push(proof.getTransactionProof().toArray());
    }

    return [this.getOwnerPredicate().getBytes(), records, proofs, this.targetValue];
  }

  public toString(): string {
    return dedent`
      SwapBillsWithDustCollectorAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Transaction Proofs: [
          ${this.proofs.map((proof) => proof.toString()).join('\n')}
        ]
        Target Value: ${this.targetValue}
      `;
  }

  public static fromArray(data: SwapBillsWithDustCollectorAttributesArray): SwapBillsWithDustCollectorAttributes {
    const proofs: TransactionRecordWithProof<TransferBillToDustCollectorPayload>[] = [];

    for (let i = 0; i < data[1].length; i++) {
      proofs.push(TransactionRecordWithProof.fromArray([data[1][i], data[2][i]]));
    }

    return new SwapBillsWithDustCollectorAttributes(new PredicateBytes(data[0]), proofs, data[3]);
  }
}
