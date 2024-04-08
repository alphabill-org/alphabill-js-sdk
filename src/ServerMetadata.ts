import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type ServerMetadataArray = readonly [bigint, Uint8Array[], bigint, Uint8Array | null];

export class ServerMetadata {
  public constructor(
    public readonly actualFee: bigint,
    private readonly _targetUnits: Uint8Array[],
    public readonly successIndicator: bigint,
    private readonly _processingDetails: Uint8Array | null,
  ) {
    this.actualFee = BigInt(this.actualFee);
    this._targetUnits = this._targetUnits.map((unit) => new Uint8Array(unit));
    this.successIndicator = BigInt(this.successIndicator);
    this._processingDetails = this._processingDetails ? new Uint8Array(this._processingDetails) : null;
  }

  public get targetUnits(): Uint8Array[] {
    return this._targetUnits.map((unit) => new Uint8Array(unit));
  }

  public get processingDetails(): Uint8Array | null {
    return this._processingDetails ? new Uint8Array(this._processingDetails) : null;
  }

  public toArray(): ServerMetadataArray {
    return [this.actualFee, this.targetUnits, this.successIndicator, this.processingDetails];
  }

  public toString(): string {
    return dedent`
      ServerMetadata
        Actual Fee: ${this.actualFee}
        Target Units: [${this._targetUnits.length ? `\n${this._targetUnits.map((unit) => Base16Converter.encode(unit)).join('\n')}\n` : ''}]
        Success indicator: ${this.successIndicator}
        Processing details: ${this._processingDetails ? Base16Converter.encode(this._processingDetails) : null}`;
  }

  public static fromArray(data: ServerMetadataArray): ServerMetadata {
    return new ServerMetadata(data[0], data[1], data[2], data[3]);
  }
}
