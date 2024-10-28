import { dedent } from '../../util/StringUtils.js';

// TODO: Fix transaction proof
/**
 * Transaction proof.
 */
export class TransactionProof {
  /**
   * Transaction proof constructor.
   * @param {unknown} _data - Blob.
   */
  public constructor(private readonly _data: unknown) {}

  /**
   * Create transaction proof from array.
   * @param {unknown} data - Transaction proof array.
   * @returns {TransactionProof} Transaction proof.
   */
  public static fromArray(data: unknown): TransactionProof {
    return new TransactionProof(data);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionProof`;
  }

  public encode(): unknown {
    return this._data;
  }
}
