import cbor from 'cbor';
import { ICborCodec } from './ICborCodec.js';

/**
 * @implements ICborCodec
 */
export class CborCodecNode implements ICborCodec {
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
  public async decode(input: Uint8Array): Promise<unknown> {
    const results = await cbor.decodeFirst(input, {
      preferWeb: true,
      extendedResults: true,
    });

    console.log(results.value);

    return results;
  }
}
