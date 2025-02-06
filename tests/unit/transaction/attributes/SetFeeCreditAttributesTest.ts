import { SetFeeCreditAttributes } from '../../../../src/fees/attributes/SetFeeCreditAttributes.js';
import { PredicateBytes } from '../../../../src/transaction/predicates/PredicateBytes.js';

describe('Set Fee credit attributes', () => {
  it('is returning correct data from decode with 0 as counter', () => {
    const attributes = SetFeeCreditAttributes.fromCbor(
      new SetFeeCreditAttributes(new PredicateBytes(new Uint8Array()), 0n, 0n).encode(),
    );
    expect(attributes.ownerPredicate.bytes).toStrictEqual(new Uint8Array());
    expect(attributes.amount).toStrictEqual(0n);
    expect(attributes.counter).toStrictEqual(0n);
  });

  it('is returning correct data from decode with null as counter', () => {
    const attributes = SetFeeCreditAttributes.fromCbor(
      new SetFeeCreditAttributes(new PredicateBytes(new Uint8Array()), 0n, null).encode(),
    );
    expect(attributes.ownerPredicate.bytes).toStrictEqual(new Uint8Array());
    expect(attributes.amount).toStrictEqual(0n);
    expect(attributes.counter).toBeNull();
  });
});
