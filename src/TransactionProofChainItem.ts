import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type TransactionProofChainItemArray = readonly [Uint8Array, boolean];

export class TransactionProofChainItem {
  public constructor(
    public readonly hash: Uint8Array,
    public readonly left: boolean,
  ) {}

  public toArray(): TransactionProofChainItemArray {
    return [this.hash, this.left];
  }

  public toString(): string {
    return dedent`
      TransactionProofChainItem
        Hash: ${Base16Converter.Encode(this.hash)}
        Left: ${this.left}`;
  }

  public static FromArray(data: TransactionProofChainItemArray): TransactionProofChainItem {
    return new TransactionProofChainItem(data[0], data[1]);
  }
}
