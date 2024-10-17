import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type OwnerProofAuthProofArray = [Uint8Array];

export class OwnerProofAuthProof implements ITransactionOrderProof {
  public constructor(private readonly _ownerProof: Uint8Array) {
    this._ownerProof = new Uint8Array(_ownerProof);
  }

  public get ownerProof(): Uint8Array {
    return new Uint8Array(this._ownerProof);
  }

  public static decode([ownerProof]: OwnerProofAuthProofArray): Promise<OwnerProofAuthProof> {
    return Promise.resolve(new OwnerProofAuthProof(ownerProof));
  }

  public encode(): OwnerProofAuthProofArray {
    return [this.ownerProof];
  }
}
