import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type TokenTypeOwnerProofsAuthProofArray = [[Uint8Array, Uint8Array], Uint8Array[]];

export class TokenTypeOwnerProofsAuthProof implements ITransactionOrderProof {
  public constructor(
    private readonly _signature: Uint8Array,
    private readonly _publicKey: Uint8Array,
    private readonly _tokenTypeOwnerProofs: (Uint8Array | null)[],
  ) {
    this._signature = new Uint8Array(_signature);
    this._publicKey = new Uint8Array(_publicKey);
    this._tokenTypeOwnerProofs = this._tokenTypeOwnerProofs.map((proof) => (proof ? new Uint8Array(proof) : null));
  }

  public get signature(): Uint8Array {
    return new Uint8Array(this._signature);
  }

  public get publicKey(): Uint8Array {
    return new Uint8Array(this._publicKey);
  }

  public get tokenTypeOwnerProofs(): (Uint8Array | null)[] {
    return this._tokenTypeOwnerProofs.map((proof) => (proof ? new Uint8Array(proof) : null));
  }

  public static async decode(data: Uint8Array, cborCodec: ICborCodec): Promise<TokenTypeOwnerProofsAuthProof> {
    const [[signature, publicKey], tokenTypeOwnerProofs] = (await cborCodec.decode(
      data,
    )) as TokenTypeOwnerProofsAuthProofArray;
    return new TokenTypeOwnerProofsAuthProof(signature, publicKey, tokenTypeOwnerProofs);
  }

  public encode(cborCodec: ICborCodec): Promise<Uint8Array> {
    return cborCodec.encode([[this.signature, this.publicKey], this.tokenTypeOwnerProofs]);
  }
}
