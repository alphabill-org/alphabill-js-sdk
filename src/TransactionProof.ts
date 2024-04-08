import { TransactionProofChainItem, TransactionProofChainItemArray } from './TransactionProofChainItem.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type TransactionProofArray = readonly [Uint8Array, TransactionProofChainItemArray[], unknown];

// TODO: Fix unicity certificate type and make it immutable
export class TransactionProof {
  public constructor(
    private readonly _blockHeaderHash: Uint8Array,
    public readonly chain: TransactionProofChainItem[],
    private readonly unicityCertificate: unknown,
  ) {
    this._blockHeaderHash = new Uint8Array(this._blockHeaderHash);
  }

  public get blockHeaderHash(): Uint8Array {
    return new Uint8Array(this._blockHeaderHash);
  }

  // TODO: Return unicity certificate

  public toArray(): TransactionProofArray {
    return [this.blockHeaderHash, this.chain.map((item) => item.toArray()), this.unicityCertificate];
  }

  public toString(): string {
    return dedent`
      TransactionProof
        Block header hash: ${Base16Converter.encode(this._blockHeaderHash)}
        Chain: [${this.chain.length ? `\n${this.chain.map((item) => item.toString()).join('\n')}\n` : ''}]`;
  }

  public static fromArray(data: TransactionProofArray): TransactionProof {
    return new TransactionProof(
      data[0],
      data[1].map((item) => TransactionProofChainItem.fromArray(item)),
      data[2],
    );
  }
}
