import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { CborTag } from '../../codec/cbor/CborTag.js';
import { UnicityCertificate } from '../../unit/UnicityCertificate.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { TransactionProofChainItem } from './TransactionProofChainItem.js';

/**
 * Transaction proof.
 */
export class TransactionProof {
  /**
   * Transaction proof constructor.
   * @param {bigint} version - version.
   * @param {Uint8Array} _blockHeaderHash - block header hash.
   * @param {TransactionProofChainItem[]} chain - chain.
   * @param {UnicityCertificate} unicityCertificate - unicity certificate.
   */
  public constructor(
    public readonly version: bigint,
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
   * Create transaction proof from raw CBOR.
   * @param {Uint8Array} rawData - Transaction proof as raw CBOR.
   * @returns {TransactionProof} Transaction proof.
   */
  public static fromCbor(rawData: Uint8Array): TransactionProof {
    const tag = CborDecoder.readTag(rawData);
    if (Number(tag.tag) !== CborTag.TRANSACTION_PROOF) {
      throw new Error(`Invalid tag, expected ${CborTag.TRANSACTION_PROOF}, was ` + tag.tag);
    }
    const data = CborDecoder.readArray(tag.data);
    return new TransactionProof(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readByteString(data[1]),
      CborDecoder.readArray(data[2])?.map((chainItem: Uint8Array) => TransactionProofChainItem.fromCbor(chainItem)) ??
        null,
      UnicityCertificate.fromCbor(data[3]),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Transaction proof as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      CborTag.TRANSACTION_PROOF,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        CborEncoder.encodeByteString(this.blockHeaderHash),
        this.chain
          ? CborEncoder.encodeArray(this.chain.map((item: TransactionProofChainItem) => item.encode()))
          : CborEncoder.encodeNull(),
        this.unicityCertificate.encode(),
      ]),
    );
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
