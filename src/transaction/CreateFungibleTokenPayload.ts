import { CreateFungibleTokenAttributes } from './CreateFungibleTokenAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';

export class CreateFungibleTokenPayload extends TransactionPayload<CreateFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'createFToken';

  public constructor(
    unitId: IUnitId,
    attributes: CreateFungibleTokenAttributes,
    clientMetadata: ITransactionClientMetadata,
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
