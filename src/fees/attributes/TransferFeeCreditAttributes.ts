import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transfer fee credit payload attributes.
 */
export class TransferFeeCreditAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'TransferFeeCreditAttributes';

  /**
   * Transfer fee credit attributes constructor.
   * @param {bigint} amount - Amount.
   * @param {number} targetPartitionIdentifier - Target partition identifier.
   * @param {IUnitId} targetUnitId - Target unit ID.
   * @param {bigint} latestAdditionTime - Latest addition time.
   * @param {bigint | null} targetUnitCounter - Target unit counter.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly amount: bigint,
    public readonly targetPartitionIdentifier: number,
    public readonly targetUnitId: IUnitId,
    public readonly latestAdditionTime: bigint,
    public readonly targetUnitCounter: bigint | null,
    public readonly counter: bigint,
  ) {
    this.amount = BigInt(this.amount);
    this.latestAdditionTime = BigInt(this.latestAdditionTime);
    this.targetUnitCounter = this.targetUnitCounter != null ? BigInt(this.targetUnitCounter) : null;
    this.counter = BigInt(this.counter);
  }

  /**
   * Create TransferFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Transfer fee credit attributes as raw CBOR.
   * @returns {TransferFeeCreditAttributes} Transfer fee credit attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): TransferFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new TransferFeeCreditAttributes(
      CborDecoder.readUnsignedInteger(data[0]),
      Number(CborDecoder.readUnsignedInteger(data[1])),
      UnitId.fromBytes(CborDecoder.readByteString(data[2])),
      CborDecoder.readUnsignedInteger(data[3]),
      CborDecoder.readOptional(data[4], CborDecoder.readUnsignedInteger),
      CborDecoder.readUnsignedInteger(data[5]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferFeeCreditAttributes
        Amount: ${this.amount}
        Target Partition ID: ${this.targetPartitionIdentifier.toString()}
        Target Unit ID: ${this.targetUnitId.toString()}
        Latest Addition Time: ${this.latestAdditionTime}
        Target Unit Counter: ${this.targetUnitCounter === null ? 'null' : this.targetUnitCounter}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.amount),
      CborEncoder.encodeUnsignedInteger(this.targetPartitionIdentifier),
      CborEncoder.encodeByteString(this.targetUnitId.bytes),
      CborEncoder.encodeUnsignedInteger(this.latestAdditionTime),
      this.targetUnitCounter != null
        ? CborEncoder.encodeUnsignedInteger(this.targetUnitCounter)
        : CborEncoder.encodeNull(),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }
}
