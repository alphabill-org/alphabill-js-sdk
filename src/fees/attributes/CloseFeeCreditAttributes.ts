import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Close fee credit payload attributes.
 */
export class CloseFeeCreditAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'CloseFeeCreditAttributes';

  /**
   * Close fee credit payload attributes constructor.
   * @param {bigint} amount Amount is the current balance of the fee credit record.
   * @param {IUnitId} targetUnitId Target unit ID is the UnitID of the existing bill in the money partition that will receive the reclaimed fee credit amount.
   * @param {bigint} targetUnitCounter Target unit counter is the current counter value of the target bill where to reclaim fee credits in money partition.
   * @param {bigint} counter Counter is the transaction counter of this fee credit record.
   */
  public constructor(
    public readonly amount: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitCounter: bigint,
    public readonly counter: bigint,
  ) {
    this.amount = BigInt(this.amount);
    this.targetUnitCounter = BigInt(this.targetUnitCounter);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create CloseFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData Close fee credit attributes as raw CBOR.
   * @returns {CloseFeeCreditAttributes} Close fee credit attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): CloseFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new CloseFeeCreditAttributes(
      CborDecoder.readUnsignedInteger(data[0]),
      UnitId.fromBytes(CborDecoder.readByteString(data[1])),
      CborDecoder.readUnsignedInteger(data[2]),
      CborDecoder.readUnsignedInteger(data[3]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      CloseFeeCreditAttributes
        Amount: ${this.amount}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Counter: ${this.targetUnitCounter}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.amount),
      CborEncoder.encodeByteString(this.targetUnitId.bytes),
      CborEncoder.encodeUnsignedInteger(this.targetUnitCounter),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }
}
