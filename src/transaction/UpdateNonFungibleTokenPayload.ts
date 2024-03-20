import { TransactionPayload } from './TransactionPayload.js';
import { UpdateNonFungibleTokenAttributes } from './UpdateNonFungibleTokenAttributes.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';

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
