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
    const proofs = Array<TransactionRecordWithProof<BurnFungibleTokenPayload>>();

    for (let i = 0; i < data[0].length; i++) {
      proofs.push(TransactionRecordWithProof.fromArray([data[0][i], data[1][i]]));
    }

    return new JoinFungibleTokenAttributes(proofs, data[2], data[3] || null);
  }
}
