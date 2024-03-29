import { SystemIdentifier } from '../SystemIdentifier.js';
import { IUnitId } from '../IUnitId.js';
import { TransactionPayload } from './TransactionPayload.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { UnlockFeeCreditAttributes } from './UnlockFeeCreditAttributes.js';

export class UnlockFeeCreditPayload extends TransactionPayload<UnlockFeeCreditAttributes> {
  public static readonly PAYLOAD_TYPE = 'unlockFC';

  public constructor(
    attributes: UnlockFeeCreditAttributes,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(UnlockFeeCreditPayload.PAYLOAD_TYPE, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
