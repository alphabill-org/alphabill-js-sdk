import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { FeeCreditPayload } from './FeeCreditPayload.js';
import { ReclaimFeeCreditAttributes } from './ReclaimFeeCreditAttributes.js';

export class ReclaimFeeCreditPayload extends FeeCreditPayload<ReclaimFeeCreditAttributes> {
  public static readonly PAYLOAD_TYPE = 'reclFC';

  public constructor(attributes: ReclaimFeeCreditAttributes, unitId: IUnitId, clientMetadata: FeeCreditClientMetadata) {
    super(ReclaimFeeCreditPayload.PAYLOAD_TYPE, SystemIdentifier.MONEY_PARTITION, unitId, attributes, clientMetadata);
  }
}
