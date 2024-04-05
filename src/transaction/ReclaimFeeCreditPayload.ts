import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { FeeCreditPayload } from './FeeCreditPayload.js';
import { ReclaimFeeCreditAttributes } from './ReclaimFeeCreditAttributes.js';

export class ReclaimFeeCreditPayload extends FeeCreditPayload<ReclaimFeeCreditAttributes> {
  public constructor(attributes: ReclaimFeeCreditAttributes, unitId: IUnitId, clientMetadata: FeeCreditClientMetadata) {
    super(
      ReclaimFeeCreditAttributes.PAYLOAD_TYPE,
      SystemIdentifier.MONEY_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
