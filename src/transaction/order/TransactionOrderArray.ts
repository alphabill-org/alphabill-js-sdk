import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { StateLockArray } from '../StateLock.js';
import { TransactionOrderType } from '../TransactionOrderType.js';
import { TransactionClientMetadataArray } from './TransactionClientMetadataArray.js';

type UnitId = Uint8Array;
type TransactionAttributes = unknown;
type StateUnlock = Uint8Array | null;
type TransactionProof = unknown | null;
type FeeProof = Uint8Array | null;

/**
 * Transaction order array.
 */
export type TransactionOrderArray = readonly [
  NetworkIdentifier,
  SystemIdentifier,
  UnitId,
  TransactionOrderType,
  TransactionAttributes,
  StateLockArray | null,
  TransactionClientMetadataArray,
  StateUnlock,
  TransactionProof,
  FeeProof,
];
