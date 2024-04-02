import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { BurnFungibleTokenPayload } from './BurnFungibleTokenPayload.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type JoinFungibleTokenAttributesArray = [
  TransactionRecordArray[],
  TransactionProofArray[],
  Uint8Array,
  Uint8Array[] | null,
];

export class JoinFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly proofs: TransactionRecordWithProof<BurnFungibleTokenPayload>[],
    public readonly backlink: Uint8Array,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): JoinFungibleTokenAttributesArray {
    return [
      this.proofs.map((proof) => proof.transactionRecord.toArray()),
      this.proofs.map((proof) => proof.transactionProof.toArray()),
      this.backlink,
      null,
    ];
  }

  public toArray(): JoinFungibleTokenAttributesArray {
    return [
      this.proofs.map((proof) => proof.transactionRecord.toArray()),
      this.proofs.map((proof) => proof.transactionProof.toArray()),
      this.backlink,
      this.invariantPredicateSignatures,
    ];
  }
}
