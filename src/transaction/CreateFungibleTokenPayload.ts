import { CreateFungibleTokenAttributes } from './CreateFungibleTokenAttributes';
import { TransactionPayload } from './TransactionPayload.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { IUnitId } from '../IUnitId.js';

export class CreateFungibleTokenPayload extends TransactionPayload<CreateFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'createFToken';

  public constructor(
    unitId: IUnitId,
    attributes: CreateFungibleTokenAttributes,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(
      CreateFungibleTokenPayload.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
