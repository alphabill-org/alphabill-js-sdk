import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { TransactionRecordWithProofArray } from '../../transaction/record/TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { BurnFungibleTokenTransactionRecordWithProof } from '../transactions/BurnFungibleTokenTransactionRecordWithProof.js';

/**
 * Join fungible token attributes array.
 */
export type JoinFungibleTokenAttributesArray = [
  TransactionRecordWithProofArray[], // Burn Fungible Token Transaction Record With Proof array
];

/**
 * Join fungible token payload attributes.
 */
export class JoinFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Join fungible token attributes constructor.
   * @param {TransactionRecordWithProof<BurnFungibleTokenAttributes>[]} _proofs - Proofs.
   */
  public constructor(private readonly _proofs: BurnFungibleTokenTransactionRecordWithProof[]) {
    this._proofs = Array.from(this._proofs);
  }

  /**
   * Get proofs.
   * @returns {BurnFungibleTokenTransactionRecordWithProof[]} Proofs.
   */
  public get proofs(): BurnFungibleTokenTransactionRecordWithProof[] {
    return Array.from(this._proofs);
  }

  /**
   * Create a JoinFungibleTokenAttributes from an array.
   * @param {JoinFungibleTokenAttributesArray} data Join fungible token attributes array.
   * @returns {JoinFungibleTokenAttributes} Join fungible token attributes instance.
   */
  public static async fromArray([proofs]: JoinFungibleTokenAttributesArray): Promise<JoinFungibleTokenAttributes> {
    return new JoinFungibleTokenAttributes(
      await Promise.all(proofs.map((proof) => BurnFungibleTokenTransactionRecordWithProof.fromArray(proof))),
    );
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public async encode(cborCodec: ICborCodec): Promise<JoinFungibleTokenAttributesArray> {
    return [await Promise.all(this.proofs.map((proof) => proof.encode(cborCodec)))];
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
