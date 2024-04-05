import { TransactionProofChainItem, TransactionProofChainItemArray } from './TransactionProofChainItem.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type TransactionProofArray = readonly [Uint8Array, TransactionProofChainItemArray[], unknown];

// TODO: Fix unicity certificate type and make it immutable
export class TransactionProof {
  public constructor(
    private readonly blockHeaderHash: Uint8Array,
    private readonly chain: TransactionProofChainItem[],
    private readonly unicityCertificate: unknown,
  ) {
    this.blockHeaderHash = new Uint8Array(this.blockHeaderHash);
  }

  public getBlockHeaderHash(): Uint8Array {
    return new Uint8Array(this.blockHeaderHash);
  }

  public getChain(): TransactionProofChainItem[] {
    return this.chain;
  }

  // TODO: Return unicity certificate

  public toArray(): TransactionProofArray {
    return [this.getBlockHeaderHash(), this.chain.map((item) => item.toArray()), this.unicityCertificate];
  }

  public toString(): string {
    return dedent`
      TransactionProof
        Block header hash: ${Base16Converter.encode(this.blockHeaderHash)}
        Chain: [
          ${this.chain.map((item) => item.toString()).join('\n')}
        ]`;
  }

  public static fromArray(data: TransactionProofArray): TransactionProof {
    return new TransactionProof(
      data[0],
      data[1].map((item) => TransactionProofChainItem.fromArray(item)),
      data[2],
    );
  }
}
