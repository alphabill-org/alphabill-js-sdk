import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type TypeOwnerProofsAuthProofArray = [Uint8Array, Uint8Array[]];

export class TypeOwnerProofsAuthProof implements ITransactionOrderProof {
  public constructor(
    private readonly _ownerProof: Uint8Array,
    private readonly _typeOwnerProofs: Uint8Array[],
  ) {
    this._ownerProof = new Uint8Array(_ownerProof);
    this._typeOwnerProofs = this._typeOwnerProofs.map((proof) => new Uint8Array(proof));
  }

  public get ownerProof(): Uint8Array {
    return new Uint8Array(this._ownerProof);
  }

  public get typeOwnerProofs(): Uint8Array[] {
    return this._typeOwnerProofs.map((proof) => new Uint8Array(proof));
  }

  public static fromCbor(rawData: Uint8Array): Promise<TypeOwnerProofsAuthProof> {
    const data = CborDecoder.readArray(rawData);
    return Promise.resolve(
      new TypeOwnerProofsAuthProof(CborDecoder.readByteString(data[0]), CborDecoder.readArray(data[1])),
    );
  }

  public encode(): TypeOwnerProofsAuthProofArray {
    return [this.ownerProof, this.typeOwnerProofs];
  }
}
