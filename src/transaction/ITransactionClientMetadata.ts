import { IUnitId } from '../IUnitId';

export interface ITransactionClientMetadata {
  readonly timeout: bigint;
  readonly maxTransactionFee: bigint;
  readonly feeCreditRecordId: IUnitId | null;
}
