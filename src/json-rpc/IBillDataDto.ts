/**
 * Bill data from getUnit.
 * @interface IBillDataDto
 */
export interface IBillDataDto {
  readonly version: bigint;
  readonly value: string;
  readonly ownerPredicate: string;
  readonly counter: string;
}
