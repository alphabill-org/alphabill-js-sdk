import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IUnitId } from '../IUnitId.js';
import { NetworkIdentifier } from '../NetworkIdentifier.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ClientMetadata } from './ClientMetadata.js';
import { IStateLock } from './IStateLock.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionAttributesType, TransactionClientMetadataArray, UnitIdType } from './order/TransactionOrder.js';
import { StateLockArray } from './StateLock.js';

export type PayloadArray = readonly [
  NetworkIdentifier,
  SystemIdentifier,
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
    public readonly networkIdentifier: NetworkIdentifier,
    public readonly systemIdentifier: SystemIdentifier,
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
        Network Identifier: ${NetworkIdentifier[this.networkIdentifier]}
        System Identifier: ${SystemIdentifier[this.systemIdentifier]}
        Unit ID: ${Base16Converter.encode(this.unitId.bytes)}
        Type: ${this.type}
        Attributes:
          ${this.attributes.toString()}
        Client Metadata:
          Timeout: ${this.clientMetadata.timeout}
          Max Transaction Fee: ${this.clientMetadata.maxTransactionFee}
          Fee Credit Record ID: ${this.clientMetadata.feeCreditRecordId ? Base16Converter.encode(this.clientMetadata.feeCreditRecordId.bytes) : null}`;
  }

  public async encode(cborCodec: ICborCodec): Promise<PayloadArray> {
    return [
      this.networkIdentifier,
      this.systemIdentifier,
      this.unitId.bytes,
      this.type,
      await this.attributes.encode(cborCodec),
      this.stateLock ? this.stateLock.encode() : null,
      ClientMetadata.encode(this.clientMetadata),
    ];
  }
}
