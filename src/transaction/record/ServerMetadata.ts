import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { TransactionStatus } from './TransactionStatus.js';

/**
 * Server metadata array.
 */
export type ServerMetadataArray = readonly [bigint, Uint8Array[], TransactionStatus, Uint8Array | null];

/**
 * Server metadata.
 */
export class ServerMetadata {
  /**
   * Server metadata constructor.
   * @param {bigint} actualFee Actual fee.
   * @param {Uint8Array[]} _targetUnits Target units.
   * @param {TransactionStatus} successIndicator Success indicator.
   * @param {Uint8Array | null} _processingDetails Processing details.
   */
  public constructor(
    public readonly actualFee: bigint,
    private readonly _targetUnits: Uint8Array[],
    public readonly successIndicator: TransactionStatus,
    private readonly _processingDetails: Uint8Array | null,
  ) {
    this.actualFee = BigInt(this.actualFee);
    this._targetUnits = this._targetUnits.map((unit) => new Uint8Array(unit));
    this._processingDetails = this._processingDetails ? new Uint8Array(this._processingDetails) : null;
  }

  /**
   * Get target units.
   * @returns {Uint8Array[]} Target units.
   */
  public get targetUnits(): Uint8Array[] {
    return this._targetUnits.map((unit) => new Uint8Array(unit));
  }

  /**
   * Get processing details.
   * @returns {Uint8Array | null} Processing details.
   */
  public get processingDetails(): Uint8Array | null {
    return this._processingDetails ? new Uint8Array(this._processingDetails) : null;
  }

  /**
   * Create server metadata from array.
   * @param {ServerMetadataArray} data Server metadata array.
   * @returns {ServerMetadata} Server metadata.
   */
  public static fromArray([
    actualFee,
    targetUnits,
    successIndicator,
    processingDetails,
  ]: ServerMetadataArray): ServerMetadata {
    return new ServerMetadata(actualFee, targetUnits, successIndicator, processingDetails);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      ServerMetadata
        Actual Fee: ${this.actualFee}
        Target Units: [${this._targetUnits.length ? `\n${this._targetUnits.map((unit) => Base16Converter.encode(unit)).join('\n')}\n` : ''}]
        Success indicator: ${TransactionStatus[this.successIndicator]}
        Processing details: ${this._processingDetails ? Base16Converter.encode(this._processingDetails) : null}`;
  }

  /**
   * Convert to array.
   * @returns {ServerMetadataArray} Server metadata array.
   */
  public encode(): ServerMetadataArray {
    return [this.actualFee, this.targetUnits, this.successIndicator, this.processingDetails];
  }
}
