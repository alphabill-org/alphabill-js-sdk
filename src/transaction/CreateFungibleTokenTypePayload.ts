import { CreateFungibleTokenTypeAttributes } from './CreateFungibleTokenTypeAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';

export class CreateFungibleTokenTypePayload extends TransactionPayload<CreateFungibleTokenTypeAttributes> {
  public static readonly PAYLOAD_TYPE = 'createFType';

  public constructor(
    unitId: IUnitId,
    attributes: CreateFungibleTokenTypeAttributes,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      CreateFungibleTokenTypePayload.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
