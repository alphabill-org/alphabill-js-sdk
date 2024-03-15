import { FeeCreditPayload } from './FeeCreditPayload.js';
import { TransferFeeCreditAttributes } from './TransferFeeCreditAttributes.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { IUnitId } from '../IUnitId.js';

export class TransferFeeCreditPayload extends FeeCreditPayload<TransferFeeCreditAttributes> {
  public static readonly PAYLOAD_TYPE = 'transFC';

  public constructor(
    attributes: TransferFeeCreditAttributes,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(TransferFeeCreditPayload.PAYLOAD_TYPE, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
