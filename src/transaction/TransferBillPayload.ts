import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferBillAttributes } from './TransferBillAttributes.js';

export class TransferBillPayload extends TransactionPayload<TransferBillAttributes> {
  public constructor(attributes: TransferBillAttributes, unitId: IUnitId, clientMetadata: ITransactionClientMetadata) {
    super(TransferBillAttributes.PAYLOAD_TYPE, SystemIdentifier.MONEY_PARTITION, unitId, attributes, clientMetadata);
  }
}
