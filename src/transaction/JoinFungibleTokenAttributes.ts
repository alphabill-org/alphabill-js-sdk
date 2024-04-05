import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { BurnFungibleTokenPayload } from './BurnFungibleTokenPayload.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type JoinFungibleTokenAttributesArray = [
  TransactionRecordArray[],
  TransactionProofArray[],
  Uint8Array,
  Uint8Array[] | null,
];

@PayloadAttribute
export class JoinFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'joinFToken';
  }

  public constructor(
    private readonly proofs: TransactionRecordWithProof<BurnFungibleTokenPayload>[],
    private readonly backlink: Uint8Array,
    private readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {
    this.backlink = new Uint8Array(this.backlink);
    this.invariantPredicateSignatures =
      this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public getProofs(): TransactionRecordWithProof<BurnFungibleTokenPayload>[] {
    return Array.from(this.proofs);
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public getInvariantPredicateSignatures(): Uint8Array[] | null {
    return this.invariantPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): JoinFungibleTokenAttributesArray {
    const records: TransactionRecordArray[] = [];
    const proofs: TransactionProofArray[] = [];
    for (const proof of this.getProofs()) {
      records.push(proof.getTransactionRecord().toArray());
      proofs.push(proof.getTransactionProof().toArray());
    }

    return [records, proofs, this.getBacklink(), null];
  }

  public toArray(): JoinFungibleTokenAttributesArray {
    const records: TransactionRecordArray[] = [];
    const proofs: TransactionProofArray[] = [];
    for (const proof of this.getProofs()) {
      records.push(proof.getTransactionRecord().toArray());
      proofs.push(proof.getTransactionProof().toArray());
    }

    return [records, proofs, this.getBacklink(), this.getInvariantPredicateSignatures()];
  }

  public toString(): string {
    return dedent`
      JoinFungibleTokenAttributes
        Proofs: ${this.proofs.map((proof) => proof.toString()).join(',\n')}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Invariant Predicate Signatures: ${
          this.invariantPredicateSignatures
            ? dedent`
        [
          ${this.invariantPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  public static fromArray(data: JoinFungibleTokenAttributesArray): JoinFungibleTokenAttributes {
    const proofs: TransactionRecordWithProof<BurnFungibleTokenPayload>[] = [];

    for (let i = 0; i < data[0].length; i++) {
      proofs.push(TransactionRecordWithProof.fromArray([data[0][i], data[1][i]]));
    }

    return new JoinFungibleTokenAttributes(proofs, data[2], data[3]);
  }
}
