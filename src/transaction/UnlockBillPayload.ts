import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { UnlockBillAttributes } from './UnlockBillAttributes.js';

export class UnlockBillPayload extends TransactionPayload<UnlockBillAttributes> {
  public static readonly PAYLOAD_TYPE = 'unlock';

  public constructor(attributes: UnlockBillAttributes, unitId: IUnitId, clientMetadata: ITransactionClientMetadata) {
    super(UnlockBillPayload.PAYLOAD_TYPE, SystemIdentifier.MONEY_PARTITION, unitId, attributes, clientMetadata);
  }
}
