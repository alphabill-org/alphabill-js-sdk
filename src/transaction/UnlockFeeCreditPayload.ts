import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { UnlockFeeCreditAttributes } from './UnlockFeeCreditAttributes.js';

export class UnlockFeeCreditPayload extends TransactionPayload<UnlockFeeCreditAttributes> {
  public constructor(
    attributes: UnlockFeeCreditAttributes,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(UnlockFeeCreditAttributes.PAYLOAD_TYPE, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
