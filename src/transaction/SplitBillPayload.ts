import { TransactionPayload } from './TransactionPayload.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { SplitBillAttributes } from './SplitBillAttributes.js';

export class SplitBillPayload extends TransactionPayload<SplitBillAttributes> {
  public static readonly PAYLOAD_TYPE = 'split';

  public constructor(attributes: SplitBillAttributes, unitId: IUnitId, clientMetadata: ITransactionClientMetadata) {
    super(SplitBillPayload.PAYLOAD_TYPE, SystemIdentifier.MONEY_PARTITION, unitId, attributes, clientMetadata);
  }
}
