import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from '../record/TransferBillToDustCollectorTransactionRecordWithProof.js';

/**
 * Swap bills with dust collector attributes array.
 */
export type SwapBillsWithDustCollectorAttributesArray = readonly [
  TransactionRecordWithProofArray[], // Transfer Bill To Dust Collector Transaction Record With Proofs
];

/**
 * Swap bills with dust collector payload attributes.
 */
export class SwapBillsWithDustCollectorAttributes implements ITransactionPayloadAttributes {
  /**
   * Swap bills with dust collector attributes constructor.
   * @param {TransactionRecordWithProof<TransferBillToDustCollectorAttributes>[]} _proofs - Transaction proofs.
   */
  public constructor(private readonly _proofs: readonly TransferBillToDustCollectorTransactionRecordWithProof[]) {
    this._proofs = Array.from(this._proofs);
  }

  /**
   * Get transaction proofs.
   * @returns {readonly TransferBillToDustCollectorTransactionRecordWithProof[]} Transaction proofs.
   */
  public get proofs(): readonly TransferBillToDustCollectorTransactionRecordWithProof[] {
    return Array.from(this._proofs);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      SwapBillsWithDustCollectorAttributes
        Transaction Proofs: [
          ${this._proofs.map((proof) => proof.toString()).join('\n')}
        ]`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public async encode(cborCodec: ICborCodec): Promise<SwapBillsWithDustCollectorAttributesArray> {
    return [await Promise.all(this.proofs.map((proof) => proof.encode(cborCodec)))];
  }

  /**
   * Create a SwapBillsWithDustCollectorAttributes object from an array.
   * @param {SwapBillsWithDustCollectorAttributesArray} data swap bills with dust collector attributes array.
   * @param {ICborCodec} cborCodec Cbor codec.
   * @returns {SwapBillsWithDustCollectorAttributes} Swap bills with dust collector attributes instance.
   */
  public static async fromArray(
    [proofs]: SwapBillsWithDustCollectorAttributesArray,
    cborCodec: ICborCodec,
  ): Promise<SwapBillsWithDustCollectorAttributes> {
    return new SwapBillsWithDustCollectorAttributes(
      await Promise.all(
        proofs.map((proof) => TransferBillToDustCollectorTransactionRecordWithProof.fromArray(proof, cborCodec)),
      ),
    );
  }
}
