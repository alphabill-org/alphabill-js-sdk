import { IPredicate } from '../transaction/predicates/IPredicate.js';

/**
 * Bill data from getUnit.
 * @interface IBillDataDto
 */
export interface IBillDataDto {
  value: string;
  ownerPredicate: IPredicate;
  locked: string;
  counter: string;
}
