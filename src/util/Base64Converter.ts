import { toByteArray, fromByteArray } from 'base64-js';

export class Base64Converter {
  /**
   * Convert byte array to Base64 encoding.
   * @param {Uint8Array} data byte array.
   * @returns string base64 string.
   */
  public static encode(data: Uint8Array): string {
    return fromByteArray(data);
  }

  /**
   * Convert Base64 string to bytes.
   * @param value base64 string.
   * @returns {Uint8Array} byte array.
   */
  public static decode(value: string): Uint8Array {
    return toByteArray(value);
  }
}
