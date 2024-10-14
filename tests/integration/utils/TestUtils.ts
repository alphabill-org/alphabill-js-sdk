import { NetworkIdentifier } from '../../../src/NetworkIdentifier.js';
import { ITransactionClientMetadata } from '../../../src/transaction/ITransactionClientMetadata.js';
import { ITransactionData } from '../../../src/transaction/order/ITransactionData.js';
import { AlwaysTruePredicate } from '../../../src/transaction/predicate/AlwaysTruePredicate.js';
import { UnitIdWithType } from '../../../src/transaction/UnitIdWithType.js';

export function createTransactionData(round: bigint, feeCreditRecordId?: UnitIdWithType): ITransactionData {
  return {
    networkIdentifier: NetworkIdentifier.LOCAL,
    stateLock: null,
    metadata: createMetadata(round, feeCreditRecordId),
    stateUnlock: new AlwaysTruePredicate(),
  };
}

export function createMetadata(round: bigint, feeCreditRecordId?: UnitIdWithType): ITransactionClientMetadata {
  return {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: feeCreditRecordId ?? null,
    referenceNumber: new Uint8Array(),
  };
}
