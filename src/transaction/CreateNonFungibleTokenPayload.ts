import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { CreateNonFungibleTokenAttributes } from './CreateNonFungibleTokenAttributes.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';

export class CreateNonFungibleTokenPayload extends TransactionPayload<CreateNonFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'createNToken';

  public constructor(
    unitId: IUnitId,
    attributes: CreateNonFungibleTokenAttributes,
    clientMetadata: ITransactionClientMetadata,
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
