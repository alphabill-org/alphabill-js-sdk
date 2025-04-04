import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { BurnFungibleToken, BurnFungibleTokenTransactionOrder } from '../transactions/BurnFungibleToken.js';

/**
 * Join fungible token payload attributes.
 */
export class JoinFungibleTokenAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'JoinFungibleTokenAttributes';

  /**
   * Join fungible token attributes constructor.
   * @param {TransactionRecordWithProof<BurnFungibleTokenAttributes>[]} _proofs - Proofs.
   */
  public constructor(private readonly _proofs: TransactionRecordWithProof<BurnFungibleTokenTransactionOrder>[]) {
    this._proofs = Array.from(this._proofs);
  }

  /**
   * Get proofs.
   * @returns {TransactionRecordWithProof<BurnFungibleTokenTransactionOrder>[]} Proofs.
   */
  public get proofs(): TransactionRecordWithProof<BurnFungibleTokenTransactionOrder>[] {
    return Array.from(this._proofs);
  }

  /**
   * Create a JoinFungibleTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData Join fungible token attributes as raw CBOR.
   * @returns {JoinFungibleTokenAttributes} Join fungible token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): JoinFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new JoinFungibleTokenAttributes(
      CborDecoder.readArray(data[0]).map((rawProof: Uint8Array) =>
        BurnFungibleToken.createTransactionRecordWithProof(rawProof),
      ),
    );
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeArray(this.proofs.map((proof) => proof.encode()))]);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      JoinFungibleTokenAttributes
        Proofs: ${this._proofs.map((proof) => proof.toString()).join(',\n')}`;
  }
}
