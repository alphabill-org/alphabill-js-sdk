import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { JoinFungibleTokenAttributes } from './JoinFungibleTokenAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';

export class JoinFungibleTokenPayload extends TransactionPayload<JoinFungibleTokenAttributes> {
  public constructor(
    attributes: JoinFungibleTokenAttributes,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      JoinFungibleTokenAttributes.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
