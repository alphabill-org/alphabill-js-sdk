import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { LockFeeCreditAttributes } from './LockFeeCreditAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';

export class LockFeeCreditPayload extends TransactionPayload<LockFeeCreditAttributes> {
  public constructor(
    attributes: LockFeeCreditAttributes,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(LockFeeCreditAttributes.PAYLOAD_TYPE, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
