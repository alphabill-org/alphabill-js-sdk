import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { AddFeeCreditAttributes } from './AddFeeCreditAttributes.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { FeeCreditPayload } from './FeeCreditPayload.js';

export class AddFeeCreditPayload extends FeeCreditPayload<AddFeeCreditAttributes> {
  public static readonly PAYLOAD_TYPE = 'addFC';

  public constructor(
    attributes: AddFeeCreditAttributes,
    systemIdentifier: SystemIdentifier,
    unitId: IUnitId,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(AddFeeCreditPayload.PAYLOAD_TYPE, systemIdentifier, unitId, attributes, clientMetadata);
  }
}
