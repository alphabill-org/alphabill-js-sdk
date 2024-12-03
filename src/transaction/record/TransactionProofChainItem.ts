import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transaction proof chain item.
 */
export class TransactionProofChainItem {
  /**
   * Transaction proof chain item constructor.
   * @param {boolean} left - Direction from parent node. True - left from parent, False - right from parent.
   * @param {Uint8Array} _hash - hash.
   */
  public constructor(
    public readonly left: boolean,
    private readonly _hash: Uint8Array,
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
   * Create transaction proof chain item from raw CBOR.
   * @param {Uint8Array} rawData - Transaction proof chain item array as raw CBOR.
   * @returns {TransactionProofChainItem} Transaction proof chain item.
   */
  public static fromCbor(rawData: Uint8Array): TransactionProofChainItem {
    const data = CborDecoder.readArray(rawData);
    return new TransactionProofChainItem(
      Boolean(CborDecoder.readUnsignedInteger(data[0])),
      CborDecoder.readByteString(data[1]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionProofChainItem
        Left: ${this.left}
        Hash: ${Base16Converter.encode(this._hash)}`;
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Transaction proof chain item as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeBoolean(this.left), CborEncoder.encodeByteString(this.hash)]);
  }
}
