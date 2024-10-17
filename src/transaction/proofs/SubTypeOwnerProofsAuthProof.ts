import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type SubTypeOwnerProofsAuthProofArray = [Uint8Array[]];

export class SubTypeOwnerProofsAuthProof implements ITransactionOrderProof {
  public constructor(private readonly _subTypeCreationProofs: Uint8Array[]) {
    this._subTypeCreationProofs = this._subTypeCreationProofs.map((proof) => new Uint8Array(proof));
  }

  public get subTypeCreationProofs(): Uint8Array[] {
    return this._subTypeCreationProofs.map((proof) => new Uint8Array(proof));
  }

  public static decode([tokenTypeOwnerProofs]: SubTypeOwnerProofsAuthProofArray): Promise<SubTypeOwnerProofsAuthProof> {
    return Promise.resolve(new SubTypeOwnerProofsAuthProof(tokenTypeOwnerProofs));
  }

  public encode(): SubTypeOwnerProofsAuthProofArray {
    return [this.subTypeCreationProofs];
  }
}
