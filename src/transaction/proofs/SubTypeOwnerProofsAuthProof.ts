import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export class SubTypeOwnerProofsAuthProof implements ITransactionOrderProof {
  public constructor(private readonly _subTypeCreationProofs: Uint8Array[]) {
    this._subTypeCreationProofs = this._subTypeCreationProofs.map((proof) => new Uint8Array(proof));
  }

  public get subTypeCreationProofs(): Uint8Array[] {
    return this._subTypeCreationProofs.map((proof) => new Uint8Array(proof));
  }

  public static fromCbor(rawData: Uint8Array): SubTypeOwnerProofsAuthProof {
    const data = CborDecoder.readArray(rawData);
    return new SubTypeOwnerProofsAuthProof(
      CborDecoder.readArray(data[0]).map((proof: Uint8Array) => CborDecoder.readByteString(proof)),
    );
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeArray(
        this.subTypeCreationProofs.map((proof: Uint8Array) => CborEncoder.encodeByteString(proof)),
      ),
    ]);
  }

  public toString(): string {
    return dedent`
      Auth Proof:
        Subtype Creation Proofs: [\n${this._subTypeCreationProofs.map((proof) => Base16Converter.encode(proof)).join('\n')}}]`;
  }
}
