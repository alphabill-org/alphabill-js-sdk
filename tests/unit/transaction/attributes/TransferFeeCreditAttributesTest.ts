import { TransferFeeCreditAttributes } from '../../../../src/fees/attributes/TransferFeeCreditAttributes.js';
import { UnitId } from '../../../../src/UnitId.js';

describe('Transfer Fee credit attributes', () => {
  it('is returning correct data from decode with 0 as counter', () => {
    const partitionIdentifier = 2;
    const attributes = TransferFeeCreditAttributes.fromCbor(
      new TransferFeeCreditAttributes(
        1n,
        partitionIdentifier,
        UnitId.fromBytes(new Uint8Array(32)),
        2n,
        0n,
        3n,
      ).encode(),
    );
    expect(attributes.amount).toStrictEqual(1n);
    expect(attributes.targetPartitionIdentifier).toStrictEqual(partitionIdentifier);
    expect(attributes.targetUnitId).toStrictEqual(UnitId.fromBytes(new Uint8Array(32)));
    expect(attributes.latestAdditionTime).toStrictEqual(2n);
    expect(attributes.targetUnitCounter).toStrictEqual(0n);
    expect(attributes.counter).toStrictEqual(3n);
  });

  it('is returning correct data from decode with null as counter', () => {
    const partitionIdentifier = 2;
    const attributes = TransferFeeCreditAttributes.fromCbor(
      new TransferFeeCreditAttributes(
        1n,
        partitionIdentifier,
        UnitId.fromBytes(new Uint8Array(32)),
        2n,
        null,
        3n,
      ).encode(),
    );
    expect(attributes.amount).toStrictEqual(1n);
    expect(attributes.targetPartitionIdentifier).toStrictEqual(partitionIdentifier);
    expect(attributes.targetUnitId).toStrictEqual(UnitId.fromBytes(new Uint8Array(32)));
    expect(attributes.latestAdditionTime).toStrictEqual(2n);
    expect(attributes.targetUnitCounter).toBeNull();
    expect(attributes.counter).toStrictEqual(3n);
  });
});
