import { encodeAsync, decodeFirst } from 'cbor-web';
import { ICborCodec } from './ICborCodec.js';

export class CborCodecWeb implements ICborCodec {
  public encode(input: unknown): Promise<Uint8Array> {
    return encodeAsync(input, {
      // Without canonical, collapseBigIntegers must be true
      canonical: true,
      encodeUndefined: () => null,
      genTypes: {
        Uint8Array: (encoder, data) => {
          return encoder.pushAny(data.buffer);
        },
      },
    });
  }

  public async decode(input: Uint8Array): Promise<unknown> {
    return decodeFirst(input);
  }
}
