import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { CborTag } from '../../codec/cbor/CborTag.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { ServerMetadata } from './ServerMetadata.js';

/**
 * Transaction record.
 * @template T - Transaction payload type.
 */
export class TransactionRecord<
  T extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof | null>,
> {
  /**
   * Transaction record constructor.
   * @param {bigint} version - version.
   * @param {TransactionOrder<T>} transactionOrder - transaction order.
   * @param {ServerMetadata} serverMetadata - server metadata.
   */
  public constructor(
    public readonly version: bigint,
    public readonly transactionOrder: T,
    public readonly serverMetadata: ServerMetadata,
  ) {}

  public static fromCbor<T extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof | null>>(
    rawData: Uint8Array,
    factory: {
      fromCbor: (rawData: Uint8Array) => T;
    },
  ): TransactionRecord<T> {
    const data = CborDecoder.readArray(CborDecoder.readTag(rawData).data);
    return new TransactionRecord(
      CborDecoder.readUnsignedInteger(data[0]),
      factory.fromCbor(data[1]),
      ServerMetadata.fromCbor(data[2]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionRecord
        ${this.version}
        ${this.transactionOrder.toString()}
        ${this.serverMetadata.toString()}`;
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      CborTag.TRANSACTION_RECORD,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        this.transactionOrder.encode(),
        this.serverMetadata.encode(),
      ]),
    );
  }
}
