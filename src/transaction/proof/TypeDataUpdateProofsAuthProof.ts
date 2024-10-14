import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type TypeDataUpdateProofsAuthProofArray = [Uint8Array, Uint8Array[]];

export class TypeDataUpdateProofsAuthProof implements ITransactionOrderProof {
  public constructor(
    private readonly _dataUpdateProof: Uint8Array,
    private readonly _typeDataUpdateProofs: (Uint8Array | null)[],
  ) {
    this._dataUpdateProof = new Uint8Array(_dataUpdateProof);
    this._typeDataUpdateProofs = this._typeDataUpdateProofs.map((proof) => (proof ? new Uint8Array(proof) : null));
  }

  public get dataUpdateProof(): Uint8Array {
    return new Uint8Array(this._dataUpdateProof);
  }

  public get tokenTypeDataUpdateProofs(): (Uint8Array | null)[] {
    return this._typeDataUpdateProofs.map((proof) => (proof ? new Uint8Array(proof) : null));
  }

  public static async decode(data: Uint8Array, cborCodec: ICborCodec): Promise<TypeDataUpdateProofsAuthProof> {
    const [dataUpdateProof, tokenTypeOwnerProofs] = (await cborCodec.decode(
      data,
    )) as TypeDataUpdateProofsAuthProofArray;
    return new TypeDataUpdateProofsAuthProof(dataUpdateProof, tokenTypeOwnerProofs);
  }

  public encode(cborCodec: ICborCodec): Promise<Uint8Array> {
    return cborCodec.encode([this.dataUpdateProof, this.tokenTypeDataUpdateProofs]);
  }
}
