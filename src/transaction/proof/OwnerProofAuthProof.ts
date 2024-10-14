import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type OwnerProofAuthProofArray = [Uint8Array];

export class OwnerProofAuthProof implements ITransactionOrderProof {
  public constructor(private readonly _ownerProof: Uint8Array) {
    this._ownerProof = new Uint8Array(_ownerProof);
  }

  public get ownerProof(): Uint8Array {
    return new Uint8Array(this._ownerProof);
  }

  public static async decode(data: Uint8Array, cborCodec: ICborCodec): Promise<OwnerProofAuthProof> {
    const [ownerProof] = (await cborCodec.decode(data)) as OwnerProofAuthProofArray;
    return new OwnerProofAuthProof(ownerProof);
  }

  public encode(cborCodec: ICborCodec): Promise<Uint8Array> {
    return cborCodec.encode([this.ownerProof]);
  }
}
