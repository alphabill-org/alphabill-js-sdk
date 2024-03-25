import { TransactionPayload } from './TransactionPayload.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { SwapBillsWithDustCollectorAttributes } from './SwapBillsWithDustCollectorAttributes.js';

export class SwapBillsWithDustCollectorPayload extends TransactionPayload<SwapBillsWithDustCollectorAttributes> {
  public static readonly PAYLOAD_TYPE = 'swapDC';

  public constructor(
    attributes: SwapBillsWithDustCollectorAttributes,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      SwapBillsWithDustCollectorPayload.PAYLOAD_TYPE,
      SystemIdentifier.MONEY_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
