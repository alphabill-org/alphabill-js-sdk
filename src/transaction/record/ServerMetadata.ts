import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { UnitId } from '../../UnitId.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { TransactionStatus } from './TransactionStatus.js';

/**
 * Server metadata.
 */
export class ServerMetadata {
  /**
   * Server metadata constructor.
   * @param {bigint} actualFee Actual fee.
   * @param {IUnitId[]} _targetUnitIds Target units.
   * @param {TransactionStatus} successIndicator Success indicator.
   * @param {Uint8Array | null} _processingDetails Processing details.
   */
  public constructor(
    public readonly actualFee: bigint,
    private readonly _targetUnitIds: readonly IUnitId[],
    public readonly successIndicator: TransactionStatus,
    private readonly _processingDetails: Uint8Array | null,
  ) {
    this.actualFee = BigInt(this.actualFee);
    this._targetUnitIds = Array.from(this._targetUnitIds);
    this._processingDetails = this._processingDetails ? new Uint8Array(this._processingDetails) : null;
  }

  public get targetUnitIds(): readonly IUnitId[] {
    return Array.from(this._targetUnitIds);
  }

  /**
   * Get processing details.
   * @returns {Uint8Array | null} Processing details.
   */
  public get processingDetails(): Uint8Array | null {
    return this._processingDetails ? new Uint8Array(this._processingDetails) : null;
  }

  /**
   * Create server metadata from raw CBOR.
   * @param {Uint8Array} rawData Server metadata as raw CBOR.
   * @returns {ServerMetadata} Server metadata.
   */
  public static fromCbor(rawData: Uint8Array): ServerMetadata {
    const data = CborDecoder.readArray(rawData);
    return new ServerMetadata(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readArray(data[1]).map((rawUnitId: Uint8Array) =>
        UnitId.fromBytes(CborDecoder.readByteString(rawUnitId)),
      ),
      Number(CborDecoder.readUnsignedInteger(data[2])),
      CborDecoder.readOptional(data[3], CborDecoder.readByteString),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      ServerMetadata
        Actual Fee: ${this.actualFee}
        Target Unit IDs: [${this._targetUnitIds.length ? `\n${this._targetUnitIds.map((unitId) => unitId.toString()).join('\n')}\n` : ''}]
        Success Indicator: ${this.successIndicator}
        Processing Details: ${this._processingDetails ? Base16Converter.encode(this._processingDetails) : null}`;
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Server metadata as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.actualFee),
      CborEncoder.encodeArray(this._targetUnitIds.map((unit) => CborEncoder.encodeByteString(unit.bytes))),
      CborEncoder.encodeUnsignedInteger(this.successIndicator),
      this.processingDetails ? CborEncoder.encodeByteString(this.processingDetails) : CborEncoder.encodeNull(),
    ]);
  }
}
