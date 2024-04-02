import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { SwapBillsWithDustCollectorAttributes } from './SwapBillsWithDustCollectorAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';

export class SwapBillsWithDustCollectorPayload extends TransactionPayload<SwapBillsWithDustCollectorAttributes> {
  public constructor(
    attributes: SwapBillsWithDustCollectorAttributes,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      SwapBillsWithDustCollectorAttributes.PAYLOAD_TYPE,
      SystemIdentifier.MONEY_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
