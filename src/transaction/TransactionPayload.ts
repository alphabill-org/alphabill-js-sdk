import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { createAttribute, PayloadType } from './PayloadAttributeFactory.js';

type TransactionClientMetadataArray = [bigint, bigint, Uint8Array | null];

/**
 * Transaction payload array.
 */
export type TransactionPayloadArray = readonly [number, string, Uint8Array, unknown, TransactionClientMetadataArray];

/**
 * Transaction payload.
 */
export class TransactionPayload<T extends ITransactionPayloadAttributes> {
  private constructor(
    public readonly type: string,
    public readonly systemIdentifier: SystemIdentifier,
    public readonly unitId: IUnitId,
    public readonly attributes: T,
    public readonly clientMetadata: ITransactionClientMetadata,
  ) {}

  /**
   * Get array for signing payload.
   * @returns {TransactionPayloadArray} signable data array.
   */
  public getSigningFields(): TransactionPayloadArray {
    return [
      this.systemIdentifier,
      this.type,
      this.unitId.bytes,
      this.attributes.toOwnerProofData(),
      this.getClientMetadataArray(),
    ];
  }

  /**
   * Convert to array.
   * @returns {TransactionPayloadArray} Array of transcation payload.
   */
  public toArray(): TransactionPayloadArray {
    return [
      this.systemIdentifier,
      this.type,
      this.unitId.bytes,
      this.attributes.toArray(),
      this.getClientMetadataArray(),
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionPayload
        Type: ${this.type}
        System Identifier: ${SystemIdentifier[this.systemIdentifier]}
        Unit ID: ${Base16Converter.encode(this.unitId.bytes)}
        Attributes:
          ${this.attributes.toString()}
        Client Metadata:
          Timeout: ${this.clientMetadata.timeout}
          Max Transaction Fee: ${this.clientMetadata.maxTransactionFee}
          Fee Credit Record ID: ${this.clientMetadata.feeCreditRecordId ? Base16Converter.encode(this.clientMetadata.feeCreditRecordId.bytes) : null}`;
  }

  /**
   * Create TransactionPayload from array.
   * @param {TransactionPayloadArray} data - Transaction payload array.
   * @returns {TransactionPayload<T>} Transaction payload instance.
   * @template T - Transaction payload attributes type.
   */
  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionPayloadArray,
  ): TransactionPayload<T> {
    return new TransactionPayload<T>(
      data[1],
      data[0],
      UnitId.fromBytes(data[2]),
      createAttribute(data[1] as PayloadType, data[3]) as T,
      {
        timeout: data[4][0],
        maxTransactionFee: data[4][1],
        feeCreditRecordId: data[4][2] ? UnitId.fromBytes(data[4][2]) : null,
      },
    );
  }

  /**
   * Creates a new TransactionPayload.
   * @param {SystemIdentifier} systemIdentifier - The system identifier.
   * @param {IUnitId} unitId - The unit ID.
   * @param {T} attributes - The payload attributes.
   * @param {ITransactionClientMetadata} clientMetadata - The client metadata.
   * @returns {TransactionPayload<T>} The transaction payload.
   */
  public static create<T extends ITransactionPayloadAttributes>(
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    attributes: T,
    clientMetadata: ITransactionClientMetadata,
  ): TransactionPayload<T> {
    return new TransactionPayload(attributes.payloadType, systemIdentifier, unitId, attributes, clientMetadata);
  }

  private getClientMetadataArray(): TransactionClientMetadataArray {
    const { timeout, maxTransactionFee, feeCreditRecordId } = this.clientMetadata;
    return [timeout, maxTransactionFee, feeCreditRecordId?.bytes || null];
  }
}
