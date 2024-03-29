import { TransactionPayload } from './TransactionPayload.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from './BurnFungibleTokenAttributes.js';

export class BurnFungibleTokenPayload extends TransactionPayload<BurnFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'burnFToken';

  public constructor(
    attributes: BurnFungibleTokenAttributes,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(BurnFungibleTokenPayload.PAYLOAD_TYPE, SystemIdentifier.TOKEN_PARTITION, unitId, attributes, clientMetadata);
  }
}
