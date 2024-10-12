import { ITransactionClientMetadata } from '../../../src/transaction/ITransactionClientMetadata.js';
import { UnitIdWithType } from '../../../src/transaction/UnitIdWithType.js';

export function createMetadata(round: bigint, feeCreditRecordId?: UnitIdWithType): ITransactionClientMetadata {
  return {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: feeCreditRecordId ?? null,
    referenceNumber: new Uint8Array(),
  };
}
