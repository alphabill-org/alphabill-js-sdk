import { CborDecoder } from '../../../../src/codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../../../src/codec/cbor/CborEncoder.js';
import { RootTrustBase } from '../../../../src/RootTrustBase.js';
import { ITransactionPayloadAttributes } from '../../../../src/transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../../../src/transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../../../src/transaction/predicates/PredicateBytes.js';
import { TransactionRecordWithProof } from '../../../../src/transaction/record/TransactionRecordWithProof.js';
import { DefaultVerificationPolicy } from '../../../../src/transaction/verification/DefaultVerificationPolicy.js';
import { VerificationResultCode } from '../../../../src/transaction/verification/VerificationResult.js';
import { Base16Converter } from '../../../../src/util/Base16Converter.js';

describe('Proof verification', () => {
  it('Verify proof', async () => {
    const data = TransactionRecordWithProof.fromCbor(
      Base16Converter.decode(
        '82d903f78301d903f88b01011a0100000158200000000000000000000000000000000000000000000000000000000000000000018344010203041864187bf684182a1845442020202043524546f6f6f68401815820000000000000000000000000000000000000000000000000000000000000000001f6d903f184015820d0f9ae3f5100bcc01e4335816ec0c815f1622ccda636bd6390ab736cf63c788480d903ef8601d903f0890101004300000143000002430000041a67a0c92c5820d80c688340917060d7f8bc903c38889d060d2361c5519e7e636f37a13267cdf3025820000000000000000000000000000000000000000000000000000000000000000082418080d903f684011a010000015820f7c9d52b4232aa507c1382fa4319120da092f769b452706196027f6e659eae9f80d903e988010001001a67a0c92c582000000000000000000000000000000000000000000000000000000000000000005820f48084d58ccd1a9284bd714fb66a4bf9d7147fd2887aa3ba3f14177775740441a1647465737458413f6e5465063778b473733d517a12382c60d05a244a306d5124565eae33d949cb280bc4dd5aef3e6a8757380fc1abeb69a37d4725655c9da08629d824f8bede6901',
      ),
      TestTransactionAttributes,
      { fromCbor: () => null },
    );

    const trustBaseDto = JSON.parse(
      '{"version":1,"epoch":1,"epochStartRound":1,"rootNodes":[{"nodeId":"test","sigKey":"0x0396607dabe5ca98dc259220ec56f8967f52d79afe0e25677e541e2376d2e9ec1d","stake":1}],"quorumThreshold":1,"stateHash":"0x01","changeRecordHash":"","previousEntryHash":"","signatures":{}}'
    );

    const result = await new DefaultVerificationPolicy().verify({
      proof: data,
      trustBase: RootTrustBase.create(trustBaseDto),
    });

    console.log(result.toString());
    expect(result.resultCode).toBe(VerificationResultCode.OK);
  });
});

class TestTransactionAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly predicate: IPredicate,
    public readonly value: bigint,
    public readonly counter: bigint,
  ) {}

  public static fromCbor(rawData: Uint8Array): TestTransactionAttributes {
    const data = CborDecoder.readArray(rawData);
    return new TestTransactionAttributes(
      new PredicateBytes(CborDecoder.readByteString(data[0])),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readUnsignedInteger(data[2]),
    );
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.predicate.bytes),
      CborEncoder.encodeUnsignedInteger(this.value),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }
}
