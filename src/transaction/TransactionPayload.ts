import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { createAttribute } from './PayloadAttribute.js';

type TransactionClientMetadataArray = [bigint, bigint, Uint8Array | null];
export type TransactionPayloadArray = readonly [number, string, Uint8Array, unknown, TransactionClientMetadataArray];

/*
 * TODO: Use only TransactionPayload class, move types to ITransactionPayloadAttributes
 */
export class TransactionPayload<T extends ITransactionPayloadAttributes> {
  public constructor(
    private readonly type: string,
    private readonly systemIdentifier: SystemIdentifier,
    private readonly unitId: IUnitId,
    private readonly attributes: T,
    private readonly clientMetadata: ITransactionClientMetadata,
  ) {
    Object.freeze(clientMetadata);
  }

  public getType(): string {
    return this.type;
  }

  public getSystemIdentifier(): SystemIdentifier {
    return this.systemIdentifier;
  }

  public getUnitId(): IUnitId {
    return this.unitId;
  }

  public getAttributes(): T {
    return this.attributes;
  }

  public getClientMetadata(): ITransactionClientMetadata {
    return this.clientMetadata;
  }

  public getSigningFields(): TransactionPayloadArray {
    return [
      this.getSystemIdentifier(),
      this.getType(),
      this.getUnitId().getBytes(),
      this.getAttributes().toOwnerProofData(),
      this.getClientMetadataArray(),
    ];
  }

  public toArray(): TransactionPayloadArray {
    return [
      this.getSystemIdentifier(),
      this.getType(),
      this.getUnitId().getBytes(),
      this.getAttributes().toArray(),
      this.getClientMetadataArray(),
    ];
  }

  public toString(): string {
    return dedent`
      TransactionPayload
        Type: ${this.type}
        System Identifier: ${SystemIdentifier[this.systemIdentifier]}
        Unit ID: ${Base16Converter.encode(this.unitId.getBytes())}
        Attributes:
          ${this.attributes.toString()}
        Client Metadata:
          Timeout: ${this.clientMetadata.timeout}
          Max Transaction Fee: ${this.clientMetadata.maxTransactionFee}
          Fee Credit Record ID: ${this.clientMetadata.feeCreditRecordId ? Base16Converter.encode(this.clientMetadata.feeCreditRecordId.getBytes()) : null}`;
  }

  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionPayloadArray,
  ): TransactionPayload<T> {
    return new TransactionPayload(data[1], data[0], UnitId.fromBytes(data[2]), createAttribute(data[1], data[3]) as T, {
      timeout: data[4][0],
      maxTransactionFee: data[4][1],
      feeCreditRecordId: data[4][2] ? UnitId.fromBytes(data[4][2]) : null,
    });
  }

  private getClientMetadataArray(): TransactionClientMetadataArray {
    const { timeout, maxTransactionFee, feeCreditRecordId } = this.getClientMetadata();
    return [timeout, maxTransactionFee, feeCreditRecordId?.getBytes() || null];
  }
}
