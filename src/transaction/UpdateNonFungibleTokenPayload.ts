import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { UpdateNonFungibleTokenAttributes } from './UpdateNonFungibleTokenAttributes.js';

export class UpdateNonFungibleTokenPayload extends TransactionPayload<UpdateNonFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'updateNToken';

  public constructor(
    unitId: IUnitId,
    attributes: UpdateNonFungibleTokenAttributes,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      UpdateNonFungibleTokenPayload.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
