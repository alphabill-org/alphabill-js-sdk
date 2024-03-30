import { TransactionProofChainItem, TransactionProofChainItemArray } from './TransactionProofChainItem.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type TransactionProofArray = readonly [Uint8Array, TransactionProofChainItemArray[], unknown];

export class TransactionProof {
  public constructor(
    public readonly blockHeaderHash: Uint8Array,
    public readonly chain: TransactionProofChainItem[],
    public readonly unicityCertificate: unknown,
  ) {}

  public toArray(): TransactionProofArray {
    return [this.blockHeaderHash, this.chain.map((item) => item.toArray()), this.unicityCertificate];
  }

  public toString(): string {
    return dedent`
      TransactionProof
        Block header hash: ${Base16Converter.encode(this.blockHeaderHash)}
        Chain: [
          ${this.chain.map((item) => item.toString()).join('\n')}
        ]`;
  }
}
