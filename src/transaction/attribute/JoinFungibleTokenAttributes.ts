import { TransactionProofArray } from '../../TransactionProof.js';
import { TransactionRecordArray } from '../../TransactionRecord.js';
import { TransactionRecordWithProof } from '../../TransactionRecordWithProof.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrderType } from '../TransactionOrderType';
import { TransactionPayload } from '../TransactionPayload.js';
import { BurnFungibleTokenAttributes } from './BurnFungibleTokenAttributes.js';

/**
 * Join fungible token attributes array.
 */
export type JoinFungibleTokenAttributesArray = [
  TransactionRecordArray[],
  TransactionProofArray[],
  bigint,
  Uint8Array[] | null,
];

/**
 * Join fungible token payload attributes.
 */
export class JoinFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Join fungible token attributes constructor.
   * @param {TransactionRecordWithProof<BurnFungibleTokenAttributes>[]} _proofs - Proofs.
   * @param {bigint} counter - Counter.
   * @param {Uint8Array[] | null} _invariantPredicateSignatures - Invariant predicate signatures.
   */
  public constructor(
    private readonly _proofs: TransactionRecordWithProof<BurnFungibleTokenAttributes>[],
    public readonly counter: bigint,
    private readonly _invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this._proofs = Array.from(this._proofs);
    this.counter = BigInt(this.counter);
    this._invariantPredicateSignatures =
      this._invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): TransactionOrderType {
    return TransactionOrderType.JoinFungibleToken;
  }

  /**
   * Get proofs.
   * @returns {TransactionRecordWithProof<BurnFungibleTokenAttributes>[]} Proofs.
   */
  public get proofs(): TransactionRecordWithProof<BurnFungibleTokenAttributes>[] {
    return Array.from(this._proofs);
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

    return [records, proofs, this.counter, null];
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

    return [records, proofs, this.counter, this.invariantPredicateSignatures];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      JoinFungibleTokenAttributes
        Proofs: ${this._proofs.map((proof) => proof.toString()).join(',\n')}
        Counter: ${this.counter}
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
    const proofs: TransactionRecordWithProof<BurnFungibleTokenAttributes>[] = [];

    for (let i = 0; i < data[0].length; i++) {
      proofs.push(TransactionRecordWithProof.fromArray([data[0][i], data[1][i]]));
    }

    return new JoinFungibleTokenAttributes(proofs, data[2], data[3]);
  }
}
