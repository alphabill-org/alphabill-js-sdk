export class TokenPartitionUnitType {
  public static get FUNGIBLE_TOKEN_TYPE(): Uint8Array {
    return new Uint8Array([0x01]);
  }

  public static get NON_FUNGIBLE_TOKEN_TYPE(): Uint8Array {
    return new Uint8Array([0x02]);
  }

  public static get FUNGIBLE_TOKEN(): Uint8Array {
    return new Uint8Array([0x03]);
  }

  public static get NON_FUNGIBLE_TOKEN(): Uint8Array {
    return new Uint8Array([0x04]);
  }
}
