import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { LockBillAttributes } from './LockBillAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';

export class LockBillPayload extends TransactionPayload<LockBillAttributes> {
  public static readonly PAYLOAD_TYPE = 'lock';

  public constructor(attributes: LockBillAttributes, unitId: IUnitId, clientMetadata: ITransactionClientMetadata) {
    super(LockBillPayload.PAYLOAD_TYPE, SystemIdentifier.MONEY_PARTITION, unitId, attributes, clientMetadata);
  }
}
