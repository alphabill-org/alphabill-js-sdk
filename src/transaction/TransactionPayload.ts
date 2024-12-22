import { CborEncoder } from '../codec/cbor/CborEncoder.js';
import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ClientMetadata } from './ClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { StateLock } from './StateLock.js';

/**
 * Transaction payload.
 */
export class TransactionPayload<T extends ITransactionPayloadAttributes> {
  public constructor(
    public readonly networkIdentifier: number,
    public readonly partitionIdentifier: number,
    public readonly unitId: IUnitId,
    public readonly type: number,
    public readonly attributes: T,
    public readonly stateLock: StateLock | null,
    public readonly clientMetadata: ClientMetadata,
  ) {}

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionPayload
        Network ID: ${this.networkIdentifier}
        Partition ID: ${this.partitionIdentifier}
        Unit ID: ${this.unitId.toString()}
        Type: ${this.type}
        Attributes:
          ${this.attributes.toString()}
        Client Metadata:
          Timeout: ${this.clientMetadata.timeout}
          Max Transaction Fee: ${this.clientMetadata.maxTransactionFee}
          Fee Credit Record ID: ${this.clientMetadata.feeCreditRecordId ? this.clientMetadata.feeCreditRecordId.toString() : null}
          Reference Number: ${this.clientMetadata.referenceNumber ? Base16Converter.encode(this.clientMetadata.referenceNumber) : null}`;
  }

  public encode(): Uint8Array[] {
    return [
      CborEncoder.encodeUnsignedInteger(this.networkIdentifier),
      CborEncoder.encodeUnsignedInteger(this.partitionIdentifier),
      CborEncoder.encodeByteString(this.unitId.bytes),
      CborEncoder.encodeUnsignedInteger(this.type),
      this.attributes.encode(),
      this.stateLock ? this.stateLock.encode() : CborEncoder.encodeNull(),
      this.clientMetadata.encode(),
    ];
  }
}
