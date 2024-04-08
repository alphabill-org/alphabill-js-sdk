import { PredicateBytes } from '../PredicateBytes.js';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferBillToDustCollectorAttributes } from './TransferBillToDustCollectorAttributes.js';

export type SwapBillsWithDustCollectorAttributesArray = readonly [
  Uint8Array,
  TransactionRecordArray[],
  TransactionProofArray[],
  bigint,
];

const PAYLOAD_TYPE = 'swapDC';

@PayloadAttribute(PAYLOAD_TYPE)
export class SwapBillsWithDustCollectorAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    private readonly _proofs: readonly TransactionRecordWithProof<
      TransactionPayload<TransferBillToDustCollectorAttributes>
    >[],
    public readonly targetValue: bigint,
  ) {
    this._proofs = Array.from(this._proofs);
    this.targetValue = BigInt(this.targetValue);
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get proofs(): readonly TransactionRecordWithProof<
    TransactionPayload<TransferBillToDustCollectorAttributes>
  >[] {
    return Array.from(this._proofs);
  }

  public toOwnerProofData(): SwapBillsWithDustCollectorAttributesArray {
    return this.toArray();
  }

  public toArray(): SwapBillsWithDustCollectorAttributesArray {
    const records: TransactionRecordArray[] = [];
    const proofs: TransactionProofArray[] = [];
    for (const proof of this.proofs) {
      records.push(proof.transactionRecord.toArray());
      proofs.push(proof.transactionProof.toArray());
    }

    return [this.ownerPredicate.bytes, records, proofs, this.targetValue];
  }

  public toString(): string {
    return dedent`
      SwapBillsWithDustCollectorAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Transaction Proofs: [
          ${this._proofs.map((proof) => proof.toString()).join('\n')}
        ]
        Target Value: ${this.targetValue}
      `;
  }

  public static fromArray(data: SwapBillsWithDustCollectorAttributesArray): SwapBillsWithDustCollectorAttributes {
    const proofs: TransactionRecordWithProof<TransactionPayload<TransferBillToDustCollectorAttributes>>[] = [];

    for (let i = 0; i < data[1].length; i++) {
      proofs.push(TransactionRecordWithProof.fromArray([data[1][i], data[2][i]]));
    }

    return new SwapBillsWithDustCollectorAttributes(new PredicateBytes(data[0]), proofs, data[3]);
  }
}
