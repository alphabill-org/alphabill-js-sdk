import * as cbor from 'cbor-web';
import { ICborCodec } from './ICborCodec.js';

/**
 * @implements ICborCodec
 */
export class CborCodecWeb implements ICborCodec {
  /**
   * @see {ICborCodec.encode}
   */
  public encode(input: unknown): Promise<Uint8Array> {
    return cbor.encodeAsync(input, {
      // Without canonical, collapseBigIntegers must be true
      canonical: true,
      encodeUndefined: () => null,
      genTypes: {
        Uint8Array: (encoder: cbor.Encoder, data: Uint8Array) => {
          return encoder.pushAny(new Uint8Array(data).buffer);
        },
      },
    }) as Promise<Uint8Array>;
  }

  /**
   * @see {ICborCodec.decode}
   */
  public decode(input: Uint8Array): Promise<unknown> {
    return cbor.decodeFirst(input, {
      preferWeb: true,
    });
  }
}
