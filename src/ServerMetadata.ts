import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type ServerMetadataArray = readonly [bigint, Uint8Array[], bigint, Uint8Array | null];

export class ServerMetadata {
  public constructor(
    public readonly actualFee: bigint,
    public readonly targetUnits: Uint8Array[],
    public readonly successIndicator: bigint,
    public readonly processingDetails: Uint8Array | null,
  ) {
    this.actualFee = BigInt(this.actualFee);
    this.targetUnits = this.targetUnits.map((unit) => new Uint8Array(unit));
    this.successIndicator = BigInt(this.successIndicator);
    this.processingDetails = this.processingDetails ? new Uint8Array(this.processingDetails) : null;
  }

  public toArray(): ServerMetadataArray {
    return [
      this.actualFee,
      this.targetUnits.map((unit) => new Uint8Array(unit)),
      this.successIndicator,
      this.processingDetails ? new Uint8Array(this.processingDetails) : null,
    ];
  }

  public toString(): string {
    return dedent`
      ServerMetadata
        Actual Fee: ${this.actualFee}
        Target Units: [
          ${this.targetUnits.map((unit) => Base16Converter.encode(unit)).join(',\n')}
        ]
        Success indicator: ${this.successIndicator}
        Processing details: ${this.processingDetails ? Base16Converter.encode(this.processingDetails) : null}`;
  }

  public static fromArray(data: ServerMetadataArray): ServerMetadata {
    return new ServerMetadata(data[0], data[1], data[2], data[3]);
  }
}
