import * as cbor from 'cbor-web';
import { ICborCodec } from './ICborCodec.js';

export class CborCodecWeb implements ICborCodec {
  public encode(input: unknown): Promise<Uint8Array> {
    return cbor.encodeAsync(input, {
      // Without canonical, collapseBigIntegers must be true
      canonical: true,
      encodeUndefined: () => null,
      genTypes: {
        Uint8Array: (encoder, data) => {
          return encoder.pushAny(data.buffer);
        },
      },
    }) as Promise<Uint8Array>;
  }

  public decode(input: Uint8Array): Promise<unknown> {
    return cbor.decodeFirst(input);
  }
}
