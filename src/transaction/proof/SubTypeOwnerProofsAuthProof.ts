import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type SubTypeOwnerProofsAuthProofArray = [[Uint8Array, Uint8Array], Uint8Array[]];

export class SubTypeOwnerProofsAuthProof implements ITransactionOrderProof {
  public constructor(
    private readonly _signature: Uint8Array,
    private readonly _publicKey: Uint8Array,
    private readonly _subTypeCreationProofs: (Uint8Array | null)[],
  ) {
    this._signature = new Uint8Array(_signature);
    this._publicKey = new Uint8Array(_publicKey);
    this._subTypeCreationProofs = this._subTypeCreationProofs.map((proof) => (proof ? new Uint8Array(proof) : null));
  }

  public get signature(): Uint8Array {
    return new Uint8Array(this._signature);
  }

  public get publicKey(): Uint8Array {
    return new Uint8Array(this._publicKey);
  }

  public get subTypeCreationProofs(): (Uint8Array | null)[] {
    return this._subTypeCreationProofs.map((proof) => (proof ? new Uint8Array(proof) : null));
  }

  public static async decode(data: Uint8Array, cborCodec: ICborCodec): Promise<SubTypeOwnerProofsAuthProof> {
    const [[signature, publicKey], tokenTypeOwnerProofs] = (await cborCodec.decode(
      data,
    )) as SubTypeOwnerProofsAuthProofArray;
    return new SubTypeOwnerProofsAuthProof(signature, publicKey, tokenTypeOwnerProofs);
  }

  public encode(cborCodec: ICborCodec): Promise<Uint8Array> {
    return cborCodec.encode([[this.signature, this.publicKey], this.subTypeCreationProofs]);
  }
}
