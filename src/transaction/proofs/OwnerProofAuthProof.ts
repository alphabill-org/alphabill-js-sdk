import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionOrderProof } from './ITransactionOrderProof.js';

export class OwnerProofAuthProof implements ITransactionOrderProof {
  private _brand: 'OwnerProofAuthProof';

  public constructor(private readonly _ownerProof: Uint8Array) {
    this._ownerProof = new Uint8Array(_ownerProof);
  }

  public get ownerProof(): Uint8Array {
    return new Uint8Array(this._ownerProof);
  }

  public static fromCbor(rawData: Uint8Array): OwnerProofAuthProof {
    const data = CborDecoder.readArray(rawData);
    return new OwnerProofAuthProof(CborDecoder.readByteString(data[0]));
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeByteString(this._ownerProof)]);
  }

  public toString(): string {
    return dedent`
      Auth Proof:
        Owner Proof: ${Base16Converter.encode(this._ownerProof)}`;
  }
}
