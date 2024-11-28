import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export type OwnerProofAuthProofArray = [Uint8Array];

export class OwnerProofAuthProof implements ITransactionOrderProof {
  public constructor(private readonly _ownerProof: Uint8Array) {
    this._ownerProof = new Uint8Array(_ownerProof);
  }

  public get ownerProof(): Uint8Array {
    return new Uint8Array(this._ownerProof);
  }

  public static fromCbor(rawData: Uint8Array): Promise<OwnerProofAuthProof> {
    const data = CborDecoder.readArray(rawData);
    return Promise.resolve(new OwnerProofAuthProof(CborDecoder.readByteString(data[0])));
  }

  public encode(): OwnerProofAuthProofArray {
    return [this.ownerProof];
  }
}
