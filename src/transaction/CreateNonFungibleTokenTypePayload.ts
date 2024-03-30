import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { CreateNonFungibleTokenTypeAttributes } from './CreateNonFungibleTokenTypeAttributes.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';

export class CreateNonFungibleTokenTypePayload extends TransactionPayload<CreateNonFungibleTokenTypeAttributes> {
  public static readonly PAYLOAD_TYPE = 'createNType';

  public constructor(
    unitId: IUnitId,
    attributes: CreateNonFungibleTokenTypeAttributes,
    clientMetadata: ITransactionClientMetadata,
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
