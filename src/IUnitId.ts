export interface IUnitId {
  // TODO: Convert bytes to class for extra functionality
  getType(): Uint8Array;
  getBytes(): Uint8Array;
}
