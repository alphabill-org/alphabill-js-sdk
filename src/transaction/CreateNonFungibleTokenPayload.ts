import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { CreateNonFungibleTokenAttributes } from './CreateNonFungibleTokenAttributes.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';

export class CreateNonFungibleTokenPayload extends TransactionPayload<CreateNonFungibleTokenAttributes> {
  public constructor(
    unitId: IUnitId,
    attributes: CreateNonFungibleTokenAttributes,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      CreateNonFungibleTokenAttributes.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
