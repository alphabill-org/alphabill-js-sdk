import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

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

  public static fromCbor(rawData: Uint8Array): TypeDataUpdateProofsAuthProof {
    const data = CborDecoder.readArray(rawData);
    return new TypeDataUpdateProofsAuthProof(CborDecoder.readByteString(data[0]), CborDecoder.readArray(data[1]));
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.dataUpdateProof),
      CborEncoder.encodeArray(this.tokenTypeDataUpdateProofs),
    ]);
  }

  public toString(): string {
    return dedent`
      Auth Proof:
        Data Update Proof: ${Base16Converter.encode(this._dataUpdateProof)}
        Type Data Update Proofs: [\n${this._typeDataUpdateProofs.map((proof) => Base16Converter.encode(proof)).join('\n')}}]`;
  }
}
