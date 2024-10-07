import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Transaction proof chain item array.
 */
export type TransactionProofChainItemArray = readonly [Uint8Array, boolean];

/**
 * Transaction proof chain item.
 */
export class TransactionProofChainItem {
  /**
   * Transaction proof chain item constructor.
   * @param {Uint8Array} _hash - hash.
   * @param {boolean} left - Direction from parent node. True - left from parent, False - right from parent.
   */
  public constructor(
    private readonly _hash: Uint8Array,
    public readonly left: boolean,
  ) {
    this._hash = new Uint8Array(this._hash);
  }

  /**
   * Get hash.
   * @returns {Uint8Array} Hash.
   */
  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionProofChainItem
        Hash: ${Base16Converter.encode(this._hash)}
        Left: ${this.left}`;
  }

  /**
   * Create transaction proof chain item from array.
   * @param {TransactionProofChainItemArray} data - Transaction proof chain item array.
   * @returns {TransactionProofChainItem} Transaction proof chain item.
   */
  public static fromArray(data: TransactionProofChainItemArray): TransactionProofChainItem {
    return new TransactionProofChainItem(data[0], data[1]);
  }
}
