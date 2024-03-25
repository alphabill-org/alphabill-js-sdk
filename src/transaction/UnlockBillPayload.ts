import { SystemIdentifier } from '../SystemIdentifier.js';
import { IUnitId } from '../IUnitId.js';
import { TransactionPayload } from './TransactionPayload.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { LockBillAttributes } from './LockBillAttributes.js';
import { UnlockBillAttributes } from './UnlockBillAttributes.js';

export class UnlockBillPayload extends TransactionPayload<UnlockBillAttributes> {
  public static readonly PAYLOAD_TYPE = 'unlock';

  public constructor(attributes: LockBillAttributes, unitId: IUnitId, clientMetadata: ITransactionClientMetadata) {
    super(UnlockBillPayload.PAYLOAD_TYPE, SystemIdentifier.MONEY_PARTITION, unitId, attributes, clientMetadata);
  }
}
