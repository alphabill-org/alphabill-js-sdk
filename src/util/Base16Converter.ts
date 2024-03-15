export class Base16Converter {
  private static BYTE_HEX_MAP = '0123456789ABCDEF';
  private static HEX_BYTE_MAP = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
  };

  /**
   * Convert byte array to hex
   * @param {Uint8Array} data byte array
   * @returns string hex string
   */
  public static encode(data: Uint8Array): string {
    let hex = '0x';
    for (let i = 0; i < data.length; i++) {
      hex += Base16Converter.BYTE_HEX_MAP[(data[i] & 0xf0) >> 4];
      hex += Base16Converter.BYTE_HEX_MAP[data[i] & 0x0f];
    }

    return hex;
  }

  /**
   * Convert hex string to bytes
   * @param value hex string
   * @returns {Uint8Array} byte array
   */
  public static decode(value: string): Uint8Array {
    if (value.length % 2 !== 0) {
      throw new Error('Octet string should have equal amount of characters');
    }
    const hex = value.toUpperCase();
    const result = [];
    for (let i = hex.startsWith('0X', 0) ? 2 : 0; i < hex.length; i += 2) {
      if (
        typeof Base16Converter.HEX_BYTE_MAP[hex[i]] === 'undefined' ||
        typeof Base16Converter.HEX_BYTE_MAP[hex[i + 1]] === 'undefined'
      ) {
        throw new Error('Invalid HEX');
      }
      result.push((Base16Converter.HEX_BYTE_MAP[hex[i]] << 4) + Base16Converter.HEX_BYTE_MAP[hex[i + 1]]);
    }

    return new Uint8Array(result);
  }
}
