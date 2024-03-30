import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferBillAttributes } from './TransferBillAttributes.js';

export class TransferBillPayload extends TransactionPayload<TransferBillAttributes> {
  public static readonly PAYLOAD_TYPE = 'trans';

  public constructor(attributes: TransferBillAttributes, unitId: IUnitId, clientMetadata: ITransactionClientMetadata) {
    super(TransferBillPayload.PAYLOAD_TYPE, SystemIdentifier.MONEY_PARTITION, unitId, attributes, clientMetadata);
  }
}
