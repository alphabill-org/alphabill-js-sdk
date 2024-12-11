import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Burn fungible token payload attributes.
 */
export class BurnFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Burn fungible token payload attributes constructor.
   * @param {IUnitId} typeId Token type ID.
   * @param {bigint} value Token value.
   * @param {IUnitId} targetTokenId Target token ID.
   * @param {bigint} targetTokenCounter Target token counter.
   * @param {bigint} counter Counter.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly targetTokenId: IUnitId,
    public readonly targetTokenCounter: bigint,
    public readonly counter: bigint,
  ) {
    this.value = BigInt(this.value);
    this.targetTokenCounter = BigInt(this.targetTokenCounter);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create BurnFungibleTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData Burn fungible token attributes as raw CBOR.
   * @returns {BurnFungibleTokenAttributes} Burn fungible token attributes.
   */
  public static fromCbor(rawData: Uint8Array): BurnFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new BurnFungibleTokenAttributes(
      UnitId.fromBytes(CborDecoder.readByteString(data[0])),
      CborDecoder.readUnsignedInteger(data[1]),
      UnitId.fromBytes(CborDecoder.readByteString(data[2])),
      CborDecoder.readUnsignedInteger(data[3]),
      CborDecoder.readUnsignedInteger(data[4]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      BurnFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Target Token ID: ${this.targetTokenId.toString()}
        Target Token Counter: ${this.targetTokenCounter}
        Counter: ${this.counter}
        `;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.typeId.bytes),
      CborEncoder.encodeUnsignedInteger(this.value),
      CborEncoder.encodeByteString(this.targetTokenId.bytes),
      CborEncoder.encodeUnsignedInteger(this.targetTokenCounter),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }
}
