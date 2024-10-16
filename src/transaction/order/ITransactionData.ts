import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicates/IPredicate.js';
import { StateLock } from '../StateLock.js';

export interface ITransactionData {
  metadata: ITransactionClientMetadata;
  stateLock: StateLock | null;
  stateUnlock: IPredicate | null;
  networkIdentifier: NetworkIdentifier;
}
