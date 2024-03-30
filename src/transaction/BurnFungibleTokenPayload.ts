import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from './BurnFungibleTokenAttributes.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';

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
