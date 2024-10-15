import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type SubTypeOwnerProofsAuthProofArray = [Uint8Array[]];

export class SubTypeOwnerProofsAuthProof implements ITransactionOrderProof {
  public constructor(private readonly _subTypeCreationProofs: Uint8Array[]) {
    this._subTypeCreationProofs = this._subTypeCreationProofs.map((proof) => new Uint8Array(proof));
  }

  public get subTypeCreationProofs(): Uint8Array[] {
    return this._subTypeCreationProofs.map((proof) => new Uint8Array(proof));
  }

  public static async decode(data: Uint8Array, cborCodec: ICborCodec): Promise<SubTypeOwnerProofsAuthProof> {
    const [tokenTypeOwnerProofs] = (await cborCodec.decode(data)) as SubTypeOwnerProofsAuthProofArray;
    return new SubTypeOwnerProofsAuthProof(tokenTypeOwnerProofs);
  }

  public encode(): SubTypeOwnerProofsAuthProofArray {
    return [this.subTypeCreationProofs];
  }
}
