import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type OwnerProofTransactionProofArray = [[Uint8Array, Uint8Array]];

export class OwnerProofTransactionProof implements ITransactionOrderProof{
  public constructor(private readonly _signature: Uint8Array,
                     private readonly _publicKey: Uint8Array) {
    this._signature = new Uint8Array(_signature);
    this._publicKey = new Uint8Array(_publicKey);
  }

  public get signature(): Uint8Array {
    return new Uint8Array(this._signature);
  }

  public get publicKey(): Uint8Array {
    return new Uint8Array(this._publicKey);
  }

  public encode(cborCodec: ICborCodec): Promise<Uint8Array> {
    return cborCodec.encode([
      [this.signature, this.publicKey]
    ]);
  }

  public static async decode(data: Uint8Array, cborCodec: ICborCodec): Promise<OwnerProofTransactionProof> {
    const [[signature, publicKey]] = await cborCodec.decode(data) as OwnerProofTransactionProofArray;
    return new OwnerProofTransactionProof(signature, publicKey);
  }
}