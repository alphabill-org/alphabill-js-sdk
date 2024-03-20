import { IUnitId } from '../IUnitId.js';

export interface ITransactionClientMetadata {
  readonly timeout: bigint;
  readonly maxTransactionFee: bigint;
  readonly feeCreditRecordId: IUnitId | null;
}
