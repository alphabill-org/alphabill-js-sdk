import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { TransactionProofChainItem, TransactionProofChainItemArray } from './TransactionProofChainItem.js';

/**
 * Transaction proof array.
 */
export type TransactionProofArray = readonly [Uint8Array, TransactionProofChainItemArray[], unknown];

// TODO: Fix unicity certificate type and make it immutable
/**
 * Transaction proof.
 */
export class TransactionProof {
  /**
   * Transaction proof constructor.
   * @param {Uint8Array} _blockHeaderHash - block header hash.
   * @param {TransactionProofChainItem[]} chain - chain.
   * @param {unknown} unicityCertificate - unicity certificate.
   */
  public constructor(
    private readonly _blockHeaderHash: Uint8Array,
    public readonly chain: TransactionProofChainItem[],
    public readonly unicityCertificate: unknown,
  ) {
    this._blockHeaderHash = new Uint8Array(this._blockHeaderHash);
  }

  /**
   * Get block header hash.
   * @returns {Uint8Array} Block header hash.
   */
  public get blockHeaderHash(): Uint8Array {
    return new Uint8Array(this._blockHeaderHash);
  }

  /**
   * Create transaction proof from array.
   * @param {TransactionProofArray} data - Transaction proof array.
   * @returns {TransactionProof} Transaction proof.
   */
  public static fromArray(data: TransactionProofArray): TransactionProof {
    return new TransactionProof(
      data[0],
      data[1].map((item) => TransactionProofChainItem.fromArray(item)),
      data[2],
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionProof
        Block header hash: ${Base16Converter.encode(this._blockHeaderHash)}
        Chain: [${this.chain.length ? `\n${this.chain.map((item) => item.toString()).join('\n')}\n` : ''}]`;
  }

  public encode(): TransactionProofArray {
    return [this.blockHeaderHash, this.chain.map((item) => item.encode()), this.unicityCertificate];
  }
}
