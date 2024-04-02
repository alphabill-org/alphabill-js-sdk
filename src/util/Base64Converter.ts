import { toByteArray, fromByteArray } from 'base64-js';

export class Base64Converter {
  /**
   * Convert byte array to base64
   * @param {Uint8Array} data byte array
   * @returns string base64 string
   */
  public static Encode(data: Uint8Array): string {
    return fromByteArray(data);
  }

  /**
   * Convert base64 string to bytes
   * @param value base64 string
   * @returns {Uint8Array} byte array
   */
  public static Decode(value: string): Uint8Array {
    return toByteArray(value);
  }
}
