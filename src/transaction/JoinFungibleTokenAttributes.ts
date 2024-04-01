import { TransactionProof, TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecord, TransactionRecordArray } from '../TransactionRecord.js';
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
    public readonly burnTransactionRecords: TransactionRecord<BurnFungibleTokenPayload>[],
    public readonly burnTransactionProofs: TransactionProof[],
    public readonly backlink: Uint8Array,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): JoinFungibleTokenAttributesArray {
    return [
      this.burnTransactionRecords.map((record) => record.toArray()),
      this.burnTransactionProofs.map((proof) => proof.toArray()),
      this.backlink,
      null,
    ];
  }

  public toArray(): JoinFungibleTokenAttributesArray {
    return [
      this.burnTransactionRecords.map((record) => record.toArray()),
      this.burnTransactionProofs.map((proof) => proof.toArray()),
      this.backlink,
      this.invariantPredicateSignatures,
    ];
  }
}
