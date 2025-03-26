import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { IPredicate } from './predicates/IPredicate.js';
import { StateLock } from './StateLock.js';

export interface ITransactionData {
  version: bigint;
  metadata: ITransactionClientMetadata;
  stateLock: StateLock | null;
  stateUnlock: IPredicate | null;
  networkIdentifier: number;
  partitionIdentifier: number;
}
