import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferBillToDustCollectorAttributes } from './TransferBillToDustCollectorAttributes.js';

export class TransferBillToDustCollectorPayload extends TransactionPayload<TransferBillToDustCollectorAttributes> {
  public constructor(
    attributes: TransferBillToDustCollectorAttributes,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      TransferBillToDustCollectorAttributes.PAYLOAD_TYPE,
      SystemIdentifier.MONEY_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
