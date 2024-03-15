import { CreateNonFungibleTokenTypeAttributes } from './CreateNonFungibleTokenTypeAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { IUnitId } from '../IUnitId.js';

export class CreateNonFungibleTokenTypePayload extends TransactionPayload<CreateNonFungibleTokenTypeAttributes> {
  public static readonly PAYLOAD_TYPE = 'createNType';

  public constructor(
    unitId: IUnitId,
    attributes: CreateNonFungibleTokenTypeAttributes,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(
      CreateNonFungibleTokenTypePayload.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
