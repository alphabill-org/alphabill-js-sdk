import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { BurnFungibleTokenAttributes } from './BurnFungibleTokenAttributes.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';
import { TransactionPayload } from './TransactionPayload.js';

/**
 * Join fungible token attributes array.
 */
export type JoinFungibleTokenAttributesArray = [
  TransactionRecordArray[],
  TransactionProofArray[],
  Uint8Array,
  Uint8Array[] | null,
];

/**
 * Join fungible token payload attributes.
 */
export class JoinFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Join fungible token attributes constructor.
   * @param {TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>>[]} _proofs - Proofs.
   * @param {Uint8Array} _backlink - Backlink.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures - Invariant predicate signatures.
   */
  public constructor(
    private readonly _proofs: TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>>[],
    private readonly _backlink: Uint8Array,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this._proofs = Array.from(this._proofs);
    this._backlink = new Uint8Array(this._backlink);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.JoinFungibleTokenAttributes;
  }

  /**
   * Get proofs.
   * @returns {TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>>[]} Proofs.
   */
  public get proofs(): TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>>[] {
    return Array.from(this._proofs);
  }

  /**
   * Get backlink.
   * @returns {Uint8Array} Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  /**
   * Get invariant predicate signatures.
   * @returns {Uint8Array[] | null} Invariant predicate signatures.
   */
  public get invariantPredicateSignatures(): Uint8Array[] | null {
    return this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): JoinFungibleTokenAttributesArray {
    const records: TransactionRecordArray[] = [];
    const proofs: TransactionProofArray[] = [];
    for (const proof of this.proofs) {
      records.push(proof.transactionRecord.toArray());
      proofs.push(proof.transactionProof.toArray());
    }

    return [records, proofs, this.backlink, null];
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): JoinFungibleTokenAttributesArray {
    const records: TransactionRecordArray[] = [];
    const proofs: TransactionProofArray[] = [];
    for (const proof of this.proofs) {
      records.push(proof.transactionRecord.toArray());
      proofs.push(proof.transactionProof.toArray());
    }

    return [records, proofs, this.backlink, this.invariantPredicateSignatures];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      JoinFungibleTokenAttributes
        Proofs: ${this._proofs.map((proof) => proof.toString()).join(',\n')}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Invariant Predicate Signatures: ${
          this._invariantPredicateSignatures
            ? dedent`
        [
          ${this._invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  /**
   * Create a JoinFungibleTokenAttributes from an array.
   * @param {JoinFungibleTokenAttributesArray} data - join fungible token attributes array.
   * @returns {JoinFungibleTokenAttributes} Join fungible token attributes instance.
   */
  public static fromArray(data: JoinFungibleTokenAttributesArray): JoinFungibleTokenAttributes {
    const proofs: TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>>[] = [];

    for (let i = 0; i < data[0].length; i++) {
      proofs.push(TransactionRecordWithProof.fromArray([data[0][i], data[1][i]]));
    }

    return new JoinFungibleTokenAttributes(proofs, data[2], data[3]);
  }
}
