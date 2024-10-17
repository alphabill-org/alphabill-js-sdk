import { IPredicate } from '../transaction/predicates/IPredicate.js';

/**
 * Non-fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  typeID: string;
  name: string;
  uri: string;
  data: string;
  ownerPredicate: IPredicate;
  dataUpdatePredicate: string;
  locked: string;
  counter: string;
}
