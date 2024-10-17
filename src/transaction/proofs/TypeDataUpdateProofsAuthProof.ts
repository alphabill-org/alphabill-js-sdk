import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type TypeDataUpdateProofsAuthProofArray = [Uint8Array, Uint8Array[]];

export class TypeDataUpdateProofsAuthProof implements ITransactionOrderProof {
  public constructor(
    private readonly _dataUpdateProof: Uint8Array,
    private readonly _typeDataUpdateProofs: Uint8Array[],
  ) {
    this._dataUpdateProof = new Uint8Array(_dataUpdateProof);
    this._typeDataUpdateProofs = this._typeDataUpdateProofs.map((proof) => new Uint8Array(proof));
  }

  public get dataUpdateProof(): Uint8Array {
    return new Uint8Array(this._dataUpdateProof);
  }

  public get tokenTypeDataUpdateProofs(): Uint8Array[] {
    return this._typeDataUpdateProofs.map((proof) => new Uint8Array(proof));
  }

  public static decode([
    dataUpdateProof,
    tokenTypeOwnerProofs,
  ]: TypeDataUpdateProofsAuthProofArray): Promise<TypeDataUpdateProofsAuthProof> {
    return Promise.resolve(new TypeDataUpdateProofsAuthProof(dataUpdateProof, tokenTypeOwnerProofs));
  }

  public encode(): TypeDataUpdateProofsAuthProofArray {
    return [this.dataUpdateProof, this.tokenTypeDataUpdateProofs];
  }
}
