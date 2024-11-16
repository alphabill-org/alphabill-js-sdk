import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IUnitId } from '../IUnitId.js';
import { NetworkIdentifier } from '../NetworkIdentifier.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ClientMetadata, TransactionClientMetadataArray } from './ClientMetadata.js';
import { IStateLock } from './IStateLock.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { StateLockArray } from './StateLock.js';

type UnitIdType = Uint8Array;
type TransactionAttributesType = unknown;

export type PayloadArray = readonly [
  NetworkIdentifier,
  number,
  UnitIdType,
  number,
  TransactionAttributesType,
  StateLockArray | null,
  TransactionClientMetadataArray,
];

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
    public readonly stateLock: IStateLock | null,
    public readonly clientMetadata: ITransactionClientMetadata,
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

  public async encode(cborCodec: ICborCodec): Promise<PayloadArray> {
    return [
      this.networkIdentifier,
      this.partitionIdentifier,
      this.unitId.bytes,
      this.type,
      await this.attributes.encode(cborCodec),
      this.stateLock ? this.stateLock.encode() : null,
      ClientMetadata.encode(this.clientMetadata),
    ];
  }
}
