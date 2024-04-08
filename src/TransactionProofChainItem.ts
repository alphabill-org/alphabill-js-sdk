import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type TransactionProofChainItemArray = readonly [Uint8Array, boolean];

export class TransactionProofChainItem {
  public constructor(
    private readonly _hash: Uint8Array,
    public readonly left: boolean,
  ) {
    this._hash = new Uint8Array(this._hash);
  }

  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  public toArray(): TransactionProofChainItemArray {
    return [this.hash, this.left];
  }

  public toString(): string {
    return dedent`
      TransactionProofChainItem
        Hash: ${Base16Converter.encode(this._hash)}
        Left: ${this.left}`;
  }

  public static fromArray(data: TransactionProofChainItemArray): TransactionProofChainItem {
    return new TransactionProofChainItem(data[0], data[1]);
  }
}
