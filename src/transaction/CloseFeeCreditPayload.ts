import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { CloseFeeCreditAttributes } from './CloseFeeCreditAttributes.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { FeeCreditPayload } from './FeeCreditPayload.js';

export class CloseFeeCreditPayload extends FeeCreditPayload<CloseFeeCreditAttributes> {
  public constructor(
    attributes: CloseFeeCreditAttributes,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(CloseFeeCreditAttributes.PAYLOAD_TYPE, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
