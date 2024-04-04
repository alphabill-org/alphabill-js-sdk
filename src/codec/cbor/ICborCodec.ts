/**
 * Cbor Codec for encoding and decoding cbor data.
 */
export interface ICborCodec {
  /**
   * Encode data to cbor bytes.
   * @param input data to encode.
   * @returns {Uint8Array} cbor bytes.
   */
  encode(input: unknown): Promise<Uint8Array>;
  /**
   * Decode cbor bytes to data.
   * @param input cbor bytes to decode.
   * @returns {unknown} decoded data.
   */
  decode(input: Uint8Array): Promise<unknown>;
}
