import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { CreateFungibleTokenTypeAttributes } from './CreateFungibleTokenTypeAttributes.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';

export class CreateFungibleTokenTypePayload extends TransactionPayload<CreateFungibleTokenTypeAttributes> {
  public constructor(
    unitId: IUnitId,
    attributes: CreateFungibleTokenTypeAttributes,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      CreateFungibleTokenTypeAttributes.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
