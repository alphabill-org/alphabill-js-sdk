import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { createAttribute } from './PayloadAttribute.js';

export type TransactionPayloadArray = readonly [
  number,
  string,
  Uint8Array,
  unknown,
  [bigint, bigint, Uint8Array | null],
];

/*
 * TODO: Use only TransactionPayload class, move types to ITransactionPayloadAttributes
 */
export class TransactionPayload<T extends ITransactionPayloadAttributes> {
  public constructor(
    public readonly type: string,
    public readonly systemIdentifier: SystemIdentifier,
    public readonly unitId: IUnitId,
    public readonly attributes: T,
    public readonly clientMetadata: ITransactionClientMetadata,
  ) {}

  public getSigningFields(): TransactionPayloadArray {
    return [
      this.systemIdentifier,
      this.type,
      this.unitId.getBytes(),
      this.attributes.toOwnerProofData(),
      [
        this.clientMetadata.timeout,
        this.clientMetadata.maxTransactionFee,
        this.clientMetadata.feeCreditRecordId?.getBytes() || null,
      ],
    ];
  }

  public toArray(): TransactionPayloadArray {
    return [
      this.systemIdentifier,
      this.type,
      this.unitId.getBytes(),
      this.attributes.toArray(),
      [
        this.clientMetadata.timeout,
        this.clientMetadata.maxTransactionFee,
        this.clientMetadata.feeCreditRecordId?.getBytes() || null,
      ],
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
    return new TransactionPayload(
      data[1],
      data[0],
      UnitId.fromBytes(new Uint8Array(data[2])),
      createAttribute(data[1], data[3]) as T,
      {
        timeout: BigInt(data[4][0]),
        maxTransactionFee: BigInt(data[4][1]),
        feeCreditRecordId: data[4][2] ? UnitId.fromBytes(new Uint8Array(data[4][2])) : null,
      },
    );
  }
}
