import { CborCodecNode } from '../../../src/codec/cbor/CborCodecNode.js';
import { ICborCodec } from '../../../src/codec/cbor/ICborCodec.js';

describe('Node Codec test - Valid input', () => {
  it('Decodes and encodes successfully', async () => {
    const base64Cbor = 'g4UAZXRyYW5zQQGDRIMAAfYB9oMAAPZBAfY=';
    const cborCodecNode: ICborCodec = new CborCodecNode();
    const parsed = await cborCodecNode.decode(Buffer.from(base64Cbor, 'base64'));
    expect(parsed[0][1]).toEqual('trans');
    const uint8Array = await cborCodecNode.encode(parsed);
    expect(Buffer.from(uint8Array).toString('base64')).toEqual(base64Cbor);
  });
});
