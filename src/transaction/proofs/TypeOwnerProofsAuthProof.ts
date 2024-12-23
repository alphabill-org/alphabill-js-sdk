import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export class TypeOwnerProofsAuthProof implements ITransactionOrderProof {
  private _brand: 'TypeOwnerProofsAuthProof';

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

  public static fromCbor(rawData: Uint8Array): TypeOwnerProofsAuthProof {
    const data = CborDecoder.readArray(rawData);
    return new TypeOwnerProofsAuthProof(CborDecoder.readByteString(data[0]), CborDecoder.readArray(data[1]));
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.ownerProof),
      CborEncoder.encodeArray(this.typeOwnerProofs),
    ]);
  }

  public toString(): string {
    return dedent`
      Auth Proof:
        Owner Proof: ${Base16Converter.encode(this._ownerProof)}
        Type Owner Proofs: [\n${this._typeOwnerProofs.map((proof) => Base16Converter.encode(proof)).join('\n')}}]`;
  }
}
