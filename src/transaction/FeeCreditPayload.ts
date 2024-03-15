import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { IUnitId } from '../IUnitId.js';

export class FeeCreditPayload<T extends ITransactionPayloadAttributes> extends TransactionPayload<T> {
  protected constructor(
    type: string,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    attributes: T,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(type, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
