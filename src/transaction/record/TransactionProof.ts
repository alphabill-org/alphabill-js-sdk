import { UnicityCertificateArray } from '../../IStateProof.js';
import { UnicityCertificate } from '../../json-rpc/UnicityCertificate.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { TransactionProofChainItem, TransactionProofChainItemArray } from './TransactionProofChainItem.js';

/**
 * Transaction proof array.
 */
export type TransactionProofArray = readonly [
  bigint,
  Uint8Array,
  TransactionProofChainItemArray[] | null,
  UnicityCertificateArray,
];

/**
 * Transaction proof.
 */
export class TransactionProof {
  /**
   * Transaction proof constructor.
   * @param {bigint} version - Alphabill version.
   * @param {Uint8Array} _blockHeaderHash - block header hash.
   * @param {TransactionProofChainItem[]} chain - chain.
   * @param {UnicityCertificate} unicityCertificate - unicity certificate.
   */
  public constructor(
    private readonly version: bigint,
    private readonly _blockHeaderHash: Uint8Array,
    public readonly chain: TransactionProofChainItem[] | null,
    public readonly unicityCertificate: UnicityCertificate,
  ) {
    this.version = BigInt(this.version);
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
      data[1],
      data[2]?.map((item) => TransactionProofChainItem.fromArray(item)) ?? null,
      UnicityCertificate.fromArray(data[3]),
    );
  }

  /**
   * Convert to array.
   * @returns {TransactionProofArray} Transaction proof array.
   */
  public encode(): TransactionProofArray {
    return [
      this.version,
      this.blockHeaderHash,
      this.chain?.map((item: TransactionProofChainItem) => item.encode()) ?? null,
      this.unicityCertificate.encode(),
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionProof
        Version: ${this.version}
        Block header hash: ${Base16Converter.encode(this._blockHeaderHash)}
        Chain: [${this.chain?.length ? `\n${this.chain.map((item) => item.toString()).join('\n')}\n` : ''}]
        ${this.unicityCertificate.toString()}`;
  }
}
