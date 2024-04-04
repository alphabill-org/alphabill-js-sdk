import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export type ServerMetadataArray = readonly [bigint, Uint8Array[], bigint, Uint8Array | null];

export class ServerMetadata {
  public constructor(
    private readonly actualFee: bigint,
    private readonly targetUnits: Uint8Array[],
    private readonly successIndicator: bigint,
    private readonly processingDetails: Uint8Array | null,
  ) {
    this.actualFee = BigInt(this.actualFee);
    this.targetUnits = this.targetUnits.map((unit) => new Uint8Array(unit));
    this.successIndicator = BigInt(this.successIndicator);
    this.processingDetails = this.processingDetails ? new Uint8Array(this.processingDetails) : null;
  }

  public getActualFee(): bigint {
    return this.actualFee;
  }

  public getTargetUnits(): Uint8Array[] {
    return this.targetUnits.map((unit) => new Uint8Array(unit));
  }

  public getSuccessIndicator(): bigint {
    return this.successIndicator;
  }

  public getProcessingDetails(): Uint8Array | null {
    return this.processingDetails ? new Uint8Array(this.processingDetails) : null;
  }

  public toArray(): ServerMetadataArray {
    return [this.getActualFee(), this.getTargetUnits(), this.getSuccessIndicator(), this.getProcessingDetails()];
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
