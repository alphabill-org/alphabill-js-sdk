import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../codec/cbor/CborEncoder.js';
import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';

export class ClientMetadata implements ITransactionClientMetadata {
  public constructor(
    public readonly timeout: bigint,
    public readonly maxTransactionFee: bigint,
    public readonly feeCreditRecordId: IUnitId | null,
    private readonly _referenceNumber: Uint8Array | null,
  ) {
    this.timeout = BigInt(this.timeout);
    this.maxTransactionFee = BigInt(this.maxTransactionFee);
    this._referenceNumber = this._referenceNumber ? new Uint8Array(this._referenceNumber) : null;
  }

  /**
   * Get reference number.
   * @returns {Uint8Array} Reference number.
   */
  public get referenceNumber(): Uint8Array | null {
    return this._referenceNumber ? new Uint8Array(this._referenceNumber) : null;
  }

  public static fromCbor(rawData: Uint8Array): ITransactionClientMetadata {
    const data = CborDecoder.readArray(rawData);
    return new ClientMetadata(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readOptional(data[2], UnitId.fromCbor),
      CborDecoder.readOptional(data[3], CborDecoder.readByteString),
    );
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.timeout),
      CborEncoder.encodeUnsignedInteger(this.maxTransactionFee),
      this.feeCreditRecordId ? CborEncoder.encodeByteString(this.feeCreditRecordId.bytes) : CborEncoder.encodeNull(),
      this._referenceNumber ? CborEncoder.encodeByteString(this._referenceNumber) : CborEncoder.encodeNull(),
    ]);
  }
}
