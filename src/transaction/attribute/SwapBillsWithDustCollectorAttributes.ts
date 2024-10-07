import { PredicateBytes } from '../../PredicateBytes.js';
import { TransactionProofArray } from '../../TransactionProof.js';
import { TransactionRecordArray } from '../../TransactionRecord.js';
import { TransactionRecordWithProof } from '../../TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrderType } from '../TransactionOrderType';
import { TransferBillToDustCollectorAttributes } from './TransferBillToDustCollectorAttributes.js';

/**
 * Swap bills with dust collector attributes array.
 */
export type SwapBillsWithDustCollectorAttributesArray = readonly [
  Uint8Array,
  TransactionRecordArray[],
  TransactionProofArray[],
  bigint,
];

/**
 * Swap bills with dust collector payload attributes.
 */
export class SwapBillsWithDustCollectorAttributes implements ITransactionPayloadAttributes {
  /**
   * Swap bills with dust collector attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {TransactionRecordWithProof<TransferBillToDustCollectorAttributes>[]} _proofs - Transaction proofs.
   * @param {bigint} targetValue - Target value.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    private readonly _proofs: readonly TransactionRecordWithProof<TransferBillToDustCollectorAttributes>[],
    public readonly targetValue: bigint,
  ) {
    this._proofs = Array.from(this._proofs);
    this.targetValue = BigInt(this.targetValue);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): TransactionOrderType {
    return TransactionOrderType.SwapBillsWithDustCollector;
  }

  /**
   * Get transaction proofs.
   * @returns {readonly TransactionRecordWithProof<TransferBillToDustCollectorAttributes>[]} Transaction proofs.
   */
  public get proofs(): readonly TransactionRecordWithProof<TransferBillToDustCollectorAttributes>[] {
    return Array.from(this._proofs);
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): SwapBillsWithDustCollectorAttributesArray {
    const records: TransactionRecordArray[] = [];
    const proofs: TransactionProofArray[] = [];
    for (const proof of this.proofs) {
      records.push(proof.transactionRecord.toArray());
      proofs.push(proof.transactionProof.toArray());
    }

    return [this.ownerPredicate.bytes, records, proofs, this.targetValue];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
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

  /**
   * Create a SwapBillsWithDustCollectorAttributes object from an array.
   * @param {SwapBillsWithDustCollectorAttributesArray} data - swap bills with dust collector attributes array.
   * @returns {SwapBillsWithDustCollectorAttributes} Swap bills with dust collector attributes instance.
   */
  public static fromArray(data: SwapBillsWithDustCollectorAttributesArray): SwapBillsWithDustCollectorAttributes {
    const proofs: TransactionRecordWithProof<TransferBillToDustCollectorAttributes>[] = [];

    for (let i = 0; i < data[1].length; i++) {
      proofs.push(TransactionRecordWithProof.fromArray([data[1][i], data[2][i]]));
    }

    return new SwapBillsWithDustCollectorAttributes(new PredicateBytes(data[0]), proofs, data[3]);
  }
}
