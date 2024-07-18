import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IStateLock } from './IStateLock.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { createAttribute, PayloadType } from './PayloadAttributeFactory.js';
import { StateLock, StateLockArray } from './StateLock.js';

type TransactionClientMetadataArray = [bigint, bigint, Uint8Array | null, Uint8Array | null];

/**
 * Transaction payload array.
 */
export type TransactionPayloadArray = readonly [
  number,
  string,
  Uint8Array,
  unknown,
  StateLockArray | null,
  TransactionClientMetadataArray,
];

/**
 * Transaction payload.
 */
export class TransactionPayload<T extends ITransactionPayloadAttributes> {
  private constructor(
    public readonly type: string,
    public readonly systemIdentifier: SystemIdentifier,
    public readonly unitId: IUnitId,
    public readonly attributes: T,
    public readonly stateLock: IStateLock | null,
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
      this.stateLock?.toArray() ?? null,
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
      this.stateLock?.toArray() ?? null,
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
      data[4] ? new StateLock(new PredicateBytes(data[4][0]), new PredicateBytes(data[4][1])) : null,
      {
        timeout: data[5][0],
        maxTransactionFee: data[5][1],
        feeCreditRecordId: data[5][2] ? UnitId.fromBytes(data[5][2]) : null,
        referenceNumber: data[5][3],
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
    return new TransactionPayload(attributes.payloadType, systemIdentifier, unitId, attributes, null, clientMetadata);
  }

  private getClientMetadataArray(): TransactionClientMetadataArray {
    const { timeout, maxTransactionFee, feeCreditRecordId, referenceNumber } = this.clientMetadata;
    return [timeout, maxTransactionFee, feeCreditRecordId?.bytes || null, referenceNumber];
  }
}
