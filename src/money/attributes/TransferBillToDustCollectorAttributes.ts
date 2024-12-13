import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transfer bill to dust collector payload attributes.
 */
export class TransferBillToDustCollectorAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer bill to dust collector attributes constructor.
   * @param {bigint} value - Value.
   * @param {IUnitId} targetUnitId - Target unit ID.
   * @param {bigint} targetUnitCounter - Target unit counter.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly value: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitCounter: bigint,
    public readonly counter: bigint,
  ) {
    this.value = BigInt(this.value);
    this.targetUnitCounter = BigInt(this.targetUnitCounter);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create TransferBillToDustCollectorAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Transfer bill to dust collector attributes data as raw CBOR.
   * @returns {TransferBillToDustCollectorAttributes} Transfer bill to dust collector attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): TransferBillToDustCollectorAttributes {
    const data = CborDecoder.readArray(rawData);
    return new TransferBillToDustCollectorAttributes(
      CborDecoder.readUnsignedInteger(data[0]),
      UnitId.fromBytes(CborDecoder.readByteString(data[1])),
      CborDecoder.readUnsignedInteger(data[2]),
      CborDecoder.readUnsignedInteger(data[3]),
    );
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.value),
      CborEncoder.encodeByteString(this.targetUnitId.bytes),
      CborEncoder.encodeUnsignedInteger(this.targetUnitCounter),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferBillToDustCollectorAttributes
        Value: ${this.value}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Counter: ${this.targetUnitCounter}
        Counter: ${this.counter}`;
  }
}
