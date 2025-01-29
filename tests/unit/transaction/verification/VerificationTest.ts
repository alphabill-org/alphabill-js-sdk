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
        '82D903F78301D903F88B01011A0100000158200000000000000000000000000000000000000000000000000000000000000000018344010203041864187BF684182A1845442020202043524546F6F6F68401815820000000000000000000000000000000000000000000000000000000000000000001F6D903F184015820D0F9AE3F5100BCC01E4335816EC0C815F1622CCDA636BD6390AB736CF63C788480D903EF8601D903F0890101004300000143000002430000041A67615A715820D80C688340917060D7F8BC903C38889D060D2361C5519E7E636F37A13267CDF3025820000000000000000000000000000000000000000000000000000000000000000082418080D903F684011A010000015820F7C9D52B4232AA507C1382FA4319120DA092F769B452706196027F6E659EAE9F80D903E98601011A67615A7158200000000000000000000000000000000000000000000000000000000000000000582060C62870BFAA7411C1029CEA95B45FF9A7977DC60141D0F10C6D29BA2FF5BF8FA164746573745841C74E533F1E428DDB34E2D628D4E0721D7F35ACB8381AC15C5A6464F3D18823AB128DF67935B1F698E6E3511CCCB0BE6C4CFF618F5248F55EE61DC233B8B8A9A300',
      ),
      TestTransactionAttributes,
      { fromCbor: () => null },
    );

    const trustBaseDto = JSON.parse(
      '{"version":1,"epoch":1,"epochStartRound":1,"rootNodes":[{"nodeId":"test","sigKey":"0x034b5e2a8bc0c27a80499b49aa2f25dffbab95ab687e7933b762abec2ea6176204","stake":1}],"quorumThreshold":1,"stateHash":"0x01","changeRecordHash":"","previousEntryHash":"","signatures":{}}',
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
