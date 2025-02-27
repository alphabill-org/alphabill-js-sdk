/**
 * Fee credit record data from getUnit.
 * @interface IFeeCreditRecordDto
 */
export interface IFeeCreditRecordDto {
  readonly version: bigint;
  readonly balance: string;
  readonly ownerPredicate: string;
  readonly locked: string;
  readonly counter: string;
  readonly minLifetime: string;
}
