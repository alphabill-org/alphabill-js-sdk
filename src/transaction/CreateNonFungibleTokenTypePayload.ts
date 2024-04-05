import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { CreateNonFungibleTokenTypeAttributes } from './CreateNonFungibleTokenTypeAttributes.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';

export class CreateNonFungibleTokenTypePayload extends TransactionPayload<CreateNonFungibleTokenTypeAttributes> {
  public constructor(
    unitId: IUnitId,
    attributes: CreateNonFungibleTokenTypeAttributes,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      CreateNonFungibleTokenTypeAttributes.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
