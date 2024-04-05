import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { FeeCreditPayload } from './FeeCreditPayload.js';
import { TransferFeeCreditAttributes } from './TransferFeeCreditAttributes.js';

export class TransferFeeCreditPayload extends FeeCreditPayload<TransferFeeCreditAttributes> {
  public constructor(
    attributes: TransferFeeCreditAttributes,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(TransferFeeCreditAttributes.PAYLOAD_TYPE, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
