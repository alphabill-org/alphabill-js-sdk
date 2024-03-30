import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type ServerMetadataArray = readonly [bigint, Uint8Array[], bigint, Uint8Array | null];
export class ServerMetadata {
  public constructor(
    public readonly actualFee: bigint,
    public readonly targetUnits: Uint8Array[],
    public readonly successIndicator: bigint,
    public readonly processingDetails: Uint8Array | null,
  ) {}

  public toArray(): ServerMetadataArray {
    return [
      this.actualFee,
      this.targetUnits.map((unit) => new Uint8Array(unit)),
      this.successIndicator,
      this.processingDetails,
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
}
