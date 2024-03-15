import { CreateNonFungibleTokenAttributes } from './CreateNonFungibleTokenAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { IUnitId } from '../IUnitId.js';

export class CreateNonFungibleTokenPayload extends TransactionPayload<CreateNonFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'createNToken';

  public constructor(
    unitId: IUnitId,
    attributes: CreateNonFungibleTokenAttributes,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(
      CreateNonFungibleTokenPayload.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
