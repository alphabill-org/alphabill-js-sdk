import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from '../transactions/TransferBillToDustCollectorTransactionRecordWithProof.js';

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
   * Create a SwapBillsWithDustCollectorAttributes object from raw CBOR.
   * @param {Uint8Array} rawData swap bills with dust collector attributes as raw CBOR.
   * @returns {SwapBillsWithDustCollectorAttributes} Swap bills with dust collector attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): SwapBillsWithDustCollectorAttributes {
    const data = CborDecoder.readArray(rawData);
    return new SwapBillsWithDustCollectorAttributes(
      CborDecoder.readArray(data[0]).map((rawProof: Uint8Array) =>
        TransferBillToDustCollectorTransactionRecordWithProof.fromCbor(rawProof),
      ),
    );
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
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeArray(this.proofs.map((proof) => proof.encode()))]);
  }
}
