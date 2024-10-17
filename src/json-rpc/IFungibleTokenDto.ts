import { IPredicate } from '../transaction/predicates/IPredicate.js';

/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  tokenType: string;
  value: string;
  ownerPredicate: IPredicate;
  locked: string;
  counter: string;
  timeout: string;
}
