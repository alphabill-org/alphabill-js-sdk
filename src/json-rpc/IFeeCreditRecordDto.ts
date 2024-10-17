import { IPredicate } from '../transaction/predicates/IPredicate.js';

/**
 * Fee credit record data from getUnit.
 * @interface IFeeCreditRecordDto
 */
export interface IFeeCreditRecordDto {
  balance: string;
  ownerPredicate: IPredicate;
  locked: string;
  counter: string;
  timeout: string;
}
